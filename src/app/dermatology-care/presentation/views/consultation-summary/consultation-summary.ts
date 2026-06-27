import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { DermatologyCareStore } from '../../../application/dermatology-care.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector:    'app-consultation-summary',
  imports:     [MatIconModule, TranslatePipe],
  templateUrl: './consultation-summary.html',
  styleUrl:    './consultation-summary.css',
})
export class ConsultationSummary implements OnInit {
  readonly store             = inject(DermatologyCareStore);
  private readonly iamStore  = inject(IamStore);
  protected router           = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly doctorPhotoUrl = signal<string | null>(null);

  ngOnInit(): void {
    const consultation = this.store.selectedConsultation();
    if (!consultation) return;
    const profile = this.store.dermatologistProfiles().find(
      p => p.userId === consultation.dermatologistId || p.id === consultation.dermatologistId,
    );
    if (profile) {
      this.iamStore.getUserById(profile.userId)
        .pipe(take(1))
        .subscribe({
          next:  user => this.doctorPhotoUrl.set(user.photoUrl ?? null),
          error: () => {},
        });
    }
  }

  readonly doctorProfile = computed(() => {
    const consultation = this.store.selectedConsultation();
    if (!consultation) return undefined;
    return this.store.dermatologistProfiles().find(
      p => p.userId === consultation.dermatologistId || p.id === consultation.dermatologistId,
    );
  });

  readonly doctorLabel = computed((): string => {
    const p = this.doctorProfile();
    if (!p) return this.translate.instant('dermatology.consultationSummary.doctorLabel');
    return p.fullName ? `Dr. ${p.fullName}` : p.specialty;
  });

  readonly doctorInitials = computed((): string => {
    const p = this.doctorProfile();
    if (!p) return '?';
    const source = p.fullName || p.specialty;
    return source.split(' ').map((w: string) => w[0] ?? '').slice(0, 2).join('').toUpperCase();
  });

  readonly formattedDate = computed((): string => {
    const c = this.store.selectedConsultation();
    if (!c?.startedAt) return '—';
    const lang = this.translate.currentLang === 'es' ? 'es-ES' : 'en-US';
    return new Date(c.startedAt).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' });
  });

  readonly formattedTime = computed((): string => {
    const c = this.store.selectedConsultation();
    if (!c?.startedAt) return '';
    const lang = this.translate.currentLang === 'es' ? 'es-ES' : 'en-US';
    return new Date(c.startedAt).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
  });

  navigateBack(): void {
    this.router.navigate(['/dermatology/select-consultation']);
  }
}
