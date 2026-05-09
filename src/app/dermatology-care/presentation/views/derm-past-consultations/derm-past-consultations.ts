import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {SlicePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {Consultation} from '../../../domain/model/consultation.entity';

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
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  searchQuery = signal<string>('');

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
