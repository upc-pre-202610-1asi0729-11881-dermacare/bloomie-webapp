import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { IntelligentSupportStore } from '../../../application/intelligent-support.store';

@Component({
  selector: 'app-ai-chat',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css',
})
export class AiChat implements OnInit {
  readonly store = inject(IntelligentSupportStore);
  protected router = inject(Router);
  readonly inputText = signal<string>('');

  ngOnInit(): void {
    const patientId = 1;
    const skinProfileId = 1;
    this.store.initializeChat(patientId, skinProfileId);
  }

  onSendMessage(): void {
    const text = this.inputText().trim();
    const currentQuery = this.store.currentQuery();
    if (!text || !currentQuery) return;
    this.store.sendMessage(text, currentQuery.id);
    this.inputText.set('');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
    }
  }

  onDismissLimitationBanner(): void {
    this.store.dismissLimitationBanner();
  }

  onNavigateToDermatologist(): void {
    this.router.navigate(['/dermatology/select-doctor']);
  }

  onNavigateBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
