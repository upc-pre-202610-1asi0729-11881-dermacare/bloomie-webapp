import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';

/**
 * Entry point for the dermatology care section.
 * Presents options to book a new appointment, view past consultations,
 * or manage scheduled appointments.
 */
@Component({
  selector:    'app-consult-home',
  imports:     [MatIconModule, TranslatePipe],
  templateUrl: './consult-home.html',
  styleUrl:    './consult-home.css',
})
export class ConsultHome {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  /** Cards displayed in the consult home section. */
  readonly cards = [
    {
      titleKey: 'dermatology.consultHome.bookTitle',
      descKey:  'dermatology.consultHome.bookDesc',
      btnKey:   'dermatology.consultHome.bookBtn',
      icon:     'calendar_month',
      action:   () => this.router.navigate(['/dermatology/select-doctor']),
    },
    {
      titleKey: 'dermatology.consultHome.pastTitle',
      descKey:  'dermatology.consultHome.pastDesc',
      btnKey:   'dermatology.consultHome.pastBtn',
      icon:     'folder_open',
      action:   () => this.router.navigate(['/dermatology/select-consultation']),
    },
    {
      titleKey: 'dermatology.consultHome.scheduledTitle',
      descKey:  'dermatology.consultHome.scheduledDesc',
      btnKey:   'dermatology.consultHome.scheduledBtn',
      icon:     'event_available',
      action:   () => this.router.navigate(['/dermatology/scheduled-appointments']),
    },
  ];

  /** Navigates back to the dashboard. */
  navigateBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
