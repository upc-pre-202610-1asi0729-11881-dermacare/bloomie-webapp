import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {IamStore} from '../../../../iam/application/iam.store';
import {Appointment, AppointmentStatus} from '../../../domain/model/appointment.entity';

export type PaymentStep = 'select' | 'add-card' | 'confirmed';
export type PaymentOption = 'credit-card' | 'debit-card' | 'google-pay' | 'yape' | null;

interface PaymentMethodOption {
  id:       PaymentOption;
  labelKey: string;
  icon:     string;
}

/**
 * Handles the three-step payment flow: method selection, card details, and confirmation.
 */
@Component({
  selector:    'app-payment-method',
  imports:     [MatIconModule, FormsModule, TranslatePipe],
  templateUrl: './payment-method.html',
  styleUrl:    './payment-method.css',
})
export class PaymentMethod {
  readonly store            = inject(DermatologyCareStore);
  private readonly iamStore = inject(IamStore);
  protected router          = inject(Router);

  step            = signal<PaymentStep>('select');
  selectedPayment = signal<PaymentOption>(null);
  showError       = signal<boolean>(false);
  cardHolderName  = '';
  cardNumber      = '';
  expirationDate  = '';
  cvv             = '';

  readonly cardMethods: PaymentMethodOption[] = [
    { id: 'credit-card', labelKey: 'dermatology.payment.creditCard', icon: 'credit_card' },
    { id: 'debit-card',  labelKey: 'dermatology.payment.debitCard',  icon: 'credit_card' },
  ];

  readonly walletMethods: PaymentMethodOption[] = [
    { id: 'google-pay', labelKey: 'dermatology.payment.googlePay', icon: 'g_mobiledata' },
    { id: 'yape',       labelKey: 'dermatology.payment.yape',       icon: 'smartphone'   },
  ];

  selectPaymentMethod(method: PaymentOption): void {
    this.selectedPayment.set(method);
  }

  proceedToCardDetails(): void {
    const selected = this.selectedPayment();
    if (selected === 'credit-card' || selected === 'debit-card') {
      this.step.set('add-card');
    }
  }

  /**
   * Formats the expiration date input to dd/mm/yyyy automatically.
   * Only allows digits and inserts slashes after day and month.
   */
  onExpirationDateInput(event: Event): void {
    const input   = event.target as HTMLInputElement;
    let value     = input.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
    if (value.length > 10) value = value.slice(0, 10);
    this.expirationDate = value;
    input.value         = value;
  }

  /**
   * Validates card fields, creates the appointment in the backend, then shows confirmation.
   */
  payNow(): void {
    if (!this.cardHolderName || !this.cardNumber || !this.expirationDate || !this.cvv) {
      this.showError.set(true);
      return;
    }
    this.showError.set(false);

    const currentUser = this.iamStore.currentUser();
    const derm        = this.store.selectedDermatologist();
    const date        = this.store.pendingAppointmentDate();
    const time        = this.store.pendingAppointmentTime();

    if (currentUser && derm && date && time) {
      const [startHour]  = time.split(':').map(Number);
      const pad          = (n: number) => String(n).padStart(2, '0');
      const scheduledAt  = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(startHour)}:00:00`;

      const appointment = new Appointment({
        id:                 0,
        patientId:          currentUser.id,
        dermatologistId:    derm.userId,
        paymentId:          0,
        scheduledAt,
        status:             AppointmentStatus.Scheduled,
        cancellationReason: '',
      });

      this.store.addAppointment(appointment);
    }

    this.step.set('confirmed');
  }

  /** Navigates to scheduled appointments after viewing confirmation. */
  goToAppointments(): void {
    this.router.navigate(['/dermatology/scheduled-appointments']);
  }

  navigateBack(): void {
    if (this.step() === 'add-card') {
      this.step.set('select');
    } else if (this.step() === 'confirmed') {
      this.router.navigate(['/dermatology/scheduled-appointments']);
    } else {
      this.router.navigate(['/dermatology/book-appointment']);
    }
  }
}
