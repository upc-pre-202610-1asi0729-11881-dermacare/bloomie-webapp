import {
  Component, ElementRef, inject, OnDestroy, OnInit,
  signal, ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';

export type DermCallTab = 'chat' | 'notes';

interface CallMessage {
  id:   number;
  from: 'doctor' | 'patient';
  text: string;
  time: string;
}

@Component({
  selector:    'app-derm-virtual-call',
  imports:     [MatIconModule, FormsModule, TranslatePipe],
  templateUrl: './derm-virtual-call.html',
  styleUrl:    './derm-virtual-call.css',
})
export class DermVirtualCall implements OnInit, OnDestroy {
  readonly store             = inject(DermatologyCareStore);
  protected router           = inject(Router);
  private readonly translate = inject(TranslateService);

  @ViewChild('selfVideo') selfVideoRef?: ElementRef<HTMLVideoElement>;

  micOn        = signal<boolean>(true);
  camOn        = signal<boolean>(false);
  showEndModal = signal<boolean>(false);
  activeTab    = signal<DermCallTab>('notes');
  callDuration = signal<string>('00:00');
  saveSuccess  = signal<boolean>(false);

  inputText = '';
  notes     = this.translate.instant('dermatology.dermCall.notesTemplate');

  messages = signal<CallMessage[]>([
    { id: 1, from: 'patient', text: this.translate.instant('dermatology.dermCall.mockMessage1'), time: '10:31' },
    { id: 2, from: 'doctor',  text: this.translate.instant('dermatology.dermCall.mockMessage2'), time: '10:32' },
    { id: 3, from: 'patient', text: this.translate.instant('dermatology.dermCall.mockMessage3'), time: '10:33' },
  ]);

  private nextId          = 4;
  private localStream:    MediaStream | null = null;
  private timerSeconds    = 0;
  private timerInterval?: ReturnType<typeof setInterval>;

  async ngOnInit(): Promise<void> {
    this.startTimer();
    await this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopAllTracks();
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      const m = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
      const s = (this.timerSeconds % 60).toString().padStart(2, '0');
      this.callDuration.set(`${m}:${s}`);
    }, 1000);
  }

  private async startCamera(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch {
        this.camOn.set(false);
        return;
      }
    }
    this.camOn.set(true);
    setTimeout(() => this.attachStreamToVideo(), 100);
  }

  private attachStreamToVideo(): void {
    const vid = this.selfVideoRef?.nativeElement;
    if (vid && this.localStream) {
      vid.srcObject = this.localStream;
      vid.play().catch(() => {});
    }
  }

  private stopAllTracks(): void {
    this.localStream?.getTracks().forEach(t => t.stop());
    this.localStream = null;
  }

  async toggleCam(): Promise<void> {
    if (this.camOn()) {
      const audioTracks = this.localStream?.getAudioTracks() ?? [];
      this.localStream?.getVideoTracks().forEach(t => t.stop());
      this.localStream = audioTracks.length > 0 ? new MediaStream(audioTracks) : null;
      this.camOn.set(false);
    } else {
      await this.startCamera();
    }
  }

  toggleMic(): void {
    const enabled = !this.micOn();
    this.localStream?.getAudioTracks().forEach(t => { t.enabled = enabled; });
    this.micOn.set(enabled);
  }

  setTab(tab: DermCallTab): void { this.activeTab.set(tab); }
  requestEndCall(): void { this.showEndModal.set(true); }
  cancelEndCall(): void  { this.showEndModal.set(false); }

  /**
   * Persists clinical notes to the consultation linked to the current appointment.
   * Follows the application layer: presentation → store → infrastructure.
   */
  saveNotes(): void {
    const appt = this.store.selectedAppointment();
    if (appt) {
      const consultation = this.store.consultations().find(c => c.appointmentId === appt.id);
      if (consultation) {
        consultation.notes = this.notes;
        this.store.updateConsultation(consultation);
      }
    }
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 2500);
  }

  confirmEndCall(): void {
    this.stopAllTracks();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.showEndModal.set(false);
    this.router.navigate(['/derm/agenda']);
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;
    this.messages.update(msgs => [
      ...msgs,
      { id: this.nextId++, from: 'doctor', text, time: this.now() }
    ]);
    this.inputText = '';
    setTimeout(() => {
      this.messages.update(msgs => [
        ...msgs,
        { id: this.nextId++, from: 'patient', text: this.translate.instant('dermatology.dermCall.mockAutoReply'), time: this.now() }
      ]);
    }, 1500);
  }

  private now(): string {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
}
