import {Component, computed, effect, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {IamStore} from '../../../../iam/application/iam.store';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {PhotoUpload} from '../../../../shared/presentation/components/photo-upload/photo-upload';

@Component({
  selector:    'app-derm-profile',
  standalone:  true,
  imports:     [MatIconModule, TranslatePipe, FormsModule, PhotoUpload],
  templateUrl: './derm-profile.html',
  styleUrl:    './derm-profile.css',
})
export class DermProfile {
  private readonly router               = inject(Router);
  protected readonly iamStore           = inject(IamStore);
  protected readonly dermatologyCareStore = inject(DermatologyCareStore);

  protected name        = signal<string>('');
  protected email       = signal<string>('');
  protected specialty   = signal<string>('');
  protected experience  = signal<string>('8');
  protected fee         = signal<string>('');
  protected saveSuccess = signal<boolean>(false);

  protected readonly currentPhotoUrl = computed(() => this.iamStore.currentUser()?.photoUrl);

  constructor() {
    const user = this.iamStore.currentUser();
    if (user) {
      this.name.set(user.name);
      this.email.set(user.email);
    }
    effect(() => {
      const profiles = this.dermatologyCareStore.dermatologistProfiles();
      const u        = this.iamStore.currentUser();
      if (!u) return;
      const profile  = profiles.find(p => p.userId === u.id);
      if (profile) {
        this.specialty.set(profile.specialty);
        this.fee.set(profile.consultationFee.toString());
      }
    });
  }

  onSaveChanges(): void {
    const user = this.iamStore.currentUser();
    if (!user) return;
    const profile = this.dermatologyCareStore.dermatologistProfiles()
      .find(p => p.userId === user.id);
    if (!profile) return;
    profile.specialty      = this.specialty();
    profile.consultationFee = parseFloat(this.fee()) || 0;
    this.dermatologyCareStore.updateDermatologistProfile(profile);
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
