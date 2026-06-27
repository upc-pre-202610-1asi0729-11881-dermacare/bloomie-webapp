import {
  Component, computed, ElementRef, inject, OnDestroy, OnInit,
  signal, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DermatologyCareStore } from '../../../application/dermatology-care.store';

interface CallMessage {
  id:   number;
  from: 'doctor' | 'patient';
  text: string;
  time: string;
}

@Component({
  selector:    'app-virtual-call',
  imports:     [MatIconModule, FormsModule, TranslatePipe],
  templateUrl: './virtual-call.html',
  styleUrl:    './virtual-call.css',
})
export class VirtualCall implements OnInit, OnDestroy {
  readonly store   = inject(DermatologyCareStore);
  protected router = inject(Router);

  @ViewChild('selfVideo') selfVideoRef?: ElementRef<HTMLVideoElement>;

  micOn        = signal<boolean>(true);
  camOn        = signal<boolean>(false);
  showEndModal = signal<boolean>(false);
  showChat     = signal<boolean>(true);
  callDuration = signal<string>('00:00');

  inputText = '';

  private localStream:    MediaStream | null = null;
  private timerSeconds    = 0;
  private timerInterval?: ReturnType<typeof setInterval>;

  readonly doctorProfile = computed(() => {
    const appt = this.store.appointments().find(a => !a.isCancelled);
    if (!appt) return undefined;
    return this.store.dermatologistProfiles().find(
      p => p.id === appt.dermatologistId || p.userId === appt.dermatologistId
    );
  });

  readonly doctorDisplayName = computed((): string => {
    const p = this.doctorProfile();
    if (!p) return 'Dermatologist';
    return p.fullName ? `Dr. ${p.fullName}` : p.specialty;
  });

  readonly doctorInitials = computed((): string => {
    const p = this.doctorProfile();
    if (!p) return 'Dr';
    const source = p.fullName || p.specialty;
    return source.split(' ').map((w: string) => w[0] ?? '').slice(0, 2).join('').toUpperCase();
  });

  messages = signal<CallMessage[]>([]);

  private nextId = 4;

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

  toggleChatPanel(): void {
    this.showChat.update(v => !v);
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;
    this.messages.update(msgs => [
      ...msgs,
      { id: this.nextId++, from: 'patient', text, time: this.now() }
    ]);
    this.inputText = '';
    setTimeout(() => {
      this.messages.update(msgs => [
        ...msgs,
        { id: this.nextId++, from: 'doctor', text: 'Understood, thank you for sharing that.', time: this.now() }
      ]);
    }, 1500);
  }

  private now(): string {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  requestEndCall(): void  { this.showEndModal.set(true); }
  cancelEndCall():  void  { this.showEndModal.set(false); }

  confirmEndCall(): void {
    this.stopAllTracks();
    this.showEndModal.set(false);
    this.router.navigate(['/dermatology/scheduled-appointments']);
  }
}
