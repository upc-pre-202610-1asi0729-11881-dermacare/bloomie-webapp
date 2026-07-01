import {Component, computed, effect, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {SlicePipe} from '@angular/common';
import {IamStore} from '../../../../iam/application/iam.store';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {PhotoUpload} from '../../../../shared/presentation/components/photo-upload/photo-upload';
import {
  formatLicenseNumber,
  LICENSE_NUMBER_MAX_LENGTH,
  LICENSE_NUMBER_PLACEHOLDER,
} from '../../../../shared/presentation/utils/license-number.util';

@Component({
  selector: 'app-derm-profile',
  standalone: true,
  imports: [MatIconModule, TranslatePipe, FormsModule, PhotoUpload, SlicePipe],
  templateUrl: './derm-profile.html',
  styleUrl: './derm-profile.css',
})
export class DermProfile {
  private readonly router = inject(Router);
  protected readonly iamStore = inject(IamStore);
  protected readonly dermatologyCareStore = inject(DermatologyCareStore);

  readonly specialties = [
    'Dermatology',
    'Pediatric Dermatology',
    'Cosmetic Dermatology',
    'Dermatopathology',
    'Mohs Surgery',
    'Teledermatology',
  ] as const;

  protected name = signal<string>('');
  protected email = signal<string>('');
  protected licenseNumber = signal<string>('');
  protected contactPhone = signal<string>('');
  protected specialty = signal<string>('');
  protected biography = signal<string>('');
  protected fee = signal<string>('');

  protected savePersonalSuccess = signal<boolean>(false);
  protected saveProfessionalSuccess = signal<boolean>(false);

  protected readonly licenseNumberPlaceholder = LICENSE_NUMBER_PLACEHOLDER;
  protected readonly licenseNumberMaxLength   = LICENSE_NUMBER_MAX_LENGTH;

  protected readonly currentPhotoUrl = computed(() => this.iamStore.currentUser()?.photoUrl);

  constructor() {
    const user = this.iamStore.currentUser();
    if (user) {
      this.name.set(user.name);
      this.email.set(user.email);
    }
    effect(() => {
      const profiles = this.dermatologyCareStore.dermatologistProfiles();
      const u = this.iamStore.currentUser();
      if (!u) return;
      const profile = profiles.find((p) => Number(p.userId) === Number(u.id));
      if (profile) {
        this.specialty.set(profile.specialty);
        this.fee.set(profile.consultationFee.toString());
        this.licenseNumber.set(profile.licenseNumber);
        this.contactPhone.set(profile.contactPhone);
        this.biography.set(profile.biography);
      }
    });
  }

  onLicenseNumberChange(rawValue: string): void {
    this.licenseNumber.set(formatLicenseNumber(rawValue));
  }

  onSavePersonal(): void {
    const user = this.iamStore.currentUser();
    if (!user) return;
    const profile = this.dermatologyCareStore
      .dermatologistProfiles()
      .find((p) => Number(p.userId) === Number(user.id));
    if (!profile) return;
    profile.licenseNumber = this.licenseNumber();
    profile.contactPhone = this.contactPhone();
    this.dermatologyCareStore.updateDermatologistProfile(profile);
    this.savePersonalSuccess.set(true);
    setTimeout(() => this.savePersonalSuccess.set(false), 2000);
  }

  onSaveProfessional(): void {
    const user = this.iamStore.currentUser();
    if (!user) return;
    const profile = this.dermatologyCareStore
      .dermatologistProfiles()
      .find((p) => Number(p.userId) === Number(user.id));
    if (!profile) return;

    if (!this.specialty() || !this.fee()) {
      alert('Specialty and fee are required');
      return;
    }

    profile.specialty = this.specialty();
    profile.consultationFee = parseFloat(this.fee()) || 0;
    profile.biography = this.biography();
    this.dermatologyCareStore.updateDermatologistProfile(profile);
    this.saveProfessionalSuccess.set(true);
    setTimeout(() => this.saveProfessionalSuccess.set(false), 2000);
  }

  onNavigateToAvailability(): void {
    this.router.navigate(['/derm/availability']).then();
  }

  onLogout(): void {
    this.iamStore.logout();
  }

  onBack(): void {
    this.router.navigate(['/derm/agenda']).then();
  }
}
