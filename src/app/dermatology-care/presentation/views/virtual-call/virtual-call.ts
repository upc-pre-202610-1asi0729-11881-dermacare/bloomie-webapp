import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';

/** Represents a single chat message in the virtual call. */
interface CallMessage {
  id:     number;
  from:   'doctor' | 'patient';
  text?:  string;
  time:   string;
}

/**
 * Provides the patient-side virtual consultation interface
 * with video controls and real-time chat.
 */
@Component({
  selector:    'app-virtual-call',
  imports:     [MatIconModule, FormsModule, TranslatePipe],
  templateUrl: './virtual-call.html',
  styleUrl:    './virtual-call.css',
})
export class VirtualCall {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  micOn        = signal<boolean>(true);
  camOn        = signal<boolean>(true);
  callEnded    = signal<boolean>(false);
  showEndModal = signal<boolean>(false);
  inputText    = '';

  messages = signal<CallMessage[]>([
    { id: 1, from: 'doctor', text: 'Hello! Let\'s start with your skin concerns today. How have you been feeling?', time: '10:31 AM' },
    { id: 2, from: 'patient', text: 'Hi Dr.! I\'ve been noticing some redness on my cheeks, especially in the mornings.', time: '10:32 AM' },
    { id: 3, from: 'doctor', text: 'I see. Could you position your face closer to the camera? That will help me assess it.', time: '10:33 AM' },
  ]);

  private nextId = 4;

  /** Toggles the microphone state. */
  toggleMic(): void {
    this.micOn.update(value => !value);
  }

  /** Toggles the camera state. */
  toggleCam(): void {
    this.camOn.update(value => !value);
  }

  /** Sends a chat message and simulates a doctor reply. */
  sendMessage(): void {
    if (!this.inputText.trim()) return;
    this.messages.update(msgs => [
      ...msgs,
      { id: this.nextId++, from: 'patient', text: this.inputText.trim(), time: 'now' }
    ]);
    this.inputText = '';
    setTimeout(() => {
      this.messages.update(msgs => [
        ...msgs,
        { id: this.nextId++, from: 'doctor', text: 'Understood, thank you for sharing that.', time: 'now' }
      ]);
    }, 1500);
  }

  /** Shows the end call confirmation modal. */
  requestEndCall(): void {
    this.showEndModal.set(true);
  }

  /** Confirms ending the call and navigates to scheduled appointments. */
  confirmEndCall(): void {
    this.callEnded.set(true);
    this.showEndModal.set(false);
    this.router.navigate(['/dermatology/scheduled-appointments']);
  }

  /** Dismisses the end call modal. */
  cancelEndCall(): void {
    this.showEndModal.set(false);
  }
}
