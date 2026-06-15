import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';

/** Panel tabs available in the dermatologist virtual call. */
export type DermCallTab = 'chat' | 'notes';

/** Represents a single chat message. */
interface CallMessage {
  id:    number;
  from:  'doctor' | 'patient';
  text?: string;
  time:  string;
}

/**
 * Provides the dermatologist-side virtual consultation interface
 * with video controls, real-time chat, and clinical notes tab.
 */
@Component({
  selector:    'app-derm-virtual-call',
  imports:     [MatIconModule, FormsModule, TranslatePipe],
  templateUrl: './derm-virtual-call.html',
  styleUrl:    './derm-virtual-call.css',
})
export class DermVirtualCall {
  readonly store             = inject(DermatologyCareStore);
  protected router           = inject(Router);
  private readonly translate = inject(TranslateService);

  micOn        = signal<boolean>(true);
  camOn        = signal<boolean>(true);
  showEndModal = signal<boolean>(false);
  activeTab    = signal<DermCallTab>('chat');
  inputText    = '';
  notes        = this.translate.instant('dermatology.dermCall.notesTemplate');

  messages = signal<CallMessage[]>([
    { id: 1, from: 'patient', text: this.translate.instant('dermatology.dermCall.mockMessage1'), time: '10:31 AM' },
    { id: 2, from: 'doctor',  text: this.translate.instant('dermatology.dermCall.mockMessage2'), time: '10:32 AM' },
    { id: 3, from: 'patient', text: this.translate.instant('dermatology.dermCall.mockMessage3'), time: '10:33 AM' },
  ]);

  private nextId = 4;

  toggleMic(): void { this.micOn.update(value => !value); }
  toggleCam(): void { this.camOn.update(value => !value); }
  setTab(tab: DermCallTab): void { this.activeTab.set(tab); }
  requestEndCall(): void { this.showEndModal.set(true); }
  cancelEndCall(): void { this.showEndModal.set(false); }

  /** Ends the call and navigates to derm agenda. */
  confirmEndCall(): void {
    this.showEndModal.set(false);
    this.router.navigate(['/derm/agenda']);
  }

  /** Sends a doctor message and simulates patient reply. */
  sendMessage(): void {
    if (!this.inputText.trim()) return;
    this.messages.update(msgs => [
      ...msgs,
      { id: this.nextId++, from: 'doctor', text: this.inputText.trim(), time: 'now' }
    ]);
    this.inputText = '';
    setTimeout(() => {
      this.messages.update(msgs => [
        ...msgs,
        { id: this.nextId++, from: 'patient', text: this.translate.instant('dermatology.dermCall.mockAutoReply'), time: 'now' }
      ]);
    }, 1500);
  }
}
