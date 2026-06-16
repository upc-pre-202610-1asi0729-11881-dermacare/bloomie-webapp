import {Component, computed, effect, inject, signal, untracked} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {SlicePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {take} from 'rxjs';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {Consultation} from '../../../domain/model/consultation.entity';
import {IamStore} from '../../../../iam/application/iam.store';

/**
 * Lists all past consultations attended by the dermatologist
 * with search filtering.
 */
@Component({
  selector:    'app-derm-past-consultations',
  imports:     [MatIconModule, FormsModule, TranslatePipe, SlicePipe],
  templateUrl: './derm-past-consultations.html',
  styleUrl:    './derm-past-consultations.css',
})
export class DermPastConsultations {
  readonly store        = inject(DermatologyCareStore);
  private readonly iamStore = inject(IamStore);
  protected router      = inject(Router);

  searchQuery = signal<string>('');

  /** Maps patient userId → photo URL. */
  protected readonly userPhotoMap = signal<Record<number, string | null>>({});

  constructor() {
    effect(() => {
      const consultations = this.store.consultations();
      const loaded        = untracked(() => this.userPhotoMap());

      consultations.forEach(c => {
        const userId = c.patientId;
        if (!(userId in loaded)) {
          this.userPhotoMap.update(m => ({...m, [userId]: null}));
          this.iamStore.getUserById(userId)
            .pipe(take(1))
            .subscribe({
              next: user => this.userPhotoMap.update(m => ({...m, [userId]: user.photoUrl ?? null})),
              error: () => {},
            });
        }
      });
    }, { allowSignalWrites: true });
  }

  protected patientPhotoForConsultation(consultation: Consultation): string | null {
    return this.userPhotoMap()[consultation.patientId] ?? null;
  }

  /** Consultations filtered by the search query. */
  readonly filteredConsultations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.store.consultations().filter(consultation =>
      !query
      || consultation.notes.toLowerCase().includes(query)
      || consultation.recommendations.toLowerCase().includes(query)
    );
  });

  /** Navigates to the derm consultation summary. */
  selectConsultation(consultation: Consultation): void {
    this.store.selectConsultation(consultation);
    this.router.navigate(['/derm/consultation-summary']);
  }

  /** Navigates back to the derm agenda. */
  navigateBack(): void {
    this.router.navigate(['/derm/agenda']);
  }
}
