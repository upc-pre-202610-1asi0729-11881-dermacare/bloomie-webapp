import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-derm-profile',
  standalone: true,
  imports: [MatIconModule, TranslatePipe, FormsModule],
  templateUrl: './derm-profile.html',
  styleUrl: './derm-profile.css',
})
export class DermProfile {
  private readonly router = inject(Router);
  protected readonly iamStore = inject(IamStore);

  protected name = signal<string>('');
  protected email = signal<string>('');
  protected specialty = signal<string>('Dermatology');
  protected experience = signal<string>('8');
  protected fee = signal<string>('25');
  protected saveSuccess = signal<boolean>(false);

  constructor() {
    const user = this.iamStore.currentUser();
    if (user) {
      this.name.set(user.name);
      this.email.set(user.email);
    }
  }

  onSaveChanges(): void {
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 2000);
  }

  onNavigateToAvailability(): void {
    this.router.navigate(['/derm/availability']).then();
  }

  onNavigateToSettings(): void {
    this.router.navigate(['/derm/settings']).then();
  }

  onLogout(): void {
    this.iamStore.logout();
  }

  onBack(): void {
    this.router.navigate(['/derm/agenda']).then();
  }
}
