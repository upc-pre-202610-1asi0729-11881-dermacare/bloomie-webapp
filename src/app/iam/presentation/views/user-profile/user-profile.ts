import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IamStore } from '../../../application/iam.store';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatIconModule, TranslatePipe, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  private readonly router = inject(Router);
  protected readonly iamStore = inject(IamStore);

  protected name = signal<string>('');
  protected email = signal<string>('');
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

  onNavigateToSkinProfile(): void {
    this.router.navigate(['/profile/skin-profile']).then();
  }

  onNavigateToSettings(): void {
    this.router.navigate(['/profile/settings']).then();
  }

  onNavigateToMyPlan(): void {
    this.router.navigate(['/profile/my-plan']).then();
  }

  onLogout(): void {
    this.iamStore.logout();
  }

  onBack(): void {
    this.router.navigate(['/dashboard']).then();
  }
}
