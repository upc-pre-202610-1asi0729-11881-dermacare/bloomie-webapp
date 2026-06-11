import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { IamStore } from '../../../application/iam.store';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-dermatologist-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, MatIconModule, RouterLink],
  templateUrl: './dermatologist-sign-up.html',
  styleUrl: './dermatologist-sign-up.css',
})
export class DermatologistSignUp {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly iamStore = inject(IamStore);

  protected readonly showPassword = signal<boolean>(false);
  protected readonly showConfirmPassword = signal<boolean>(false);
  protected readonly submitted = signal<boolean>(false);

  protected readonly specialties = [
    'Dermatology',
    'Pediatric Dermatology',
    'Cosmetic Dermatology',
    'Dermatopathology',
    'Mohs Surgery',
    'Teledermatology',
  ];

  protected readonly form = this.formBuilder.group(
    {
      firstName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      specialty: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator },
  );

  togglePasswordVisibility = (): void => {
    this.showPassword.update((v) => !v);
  };

  toggleConfirmPasswordVisibility = (): void => {
    this.showConfirmPassword.update((v) => !v);
  };

  onSubmit = (): void => {
    this.submitted.set(true);
    if (this.form.invalid) return;
    const { firstName, lastName, email, specialty, password } = this.form.getRawValue();
    this.iamStore.registerDermatologist(email, password, firstName, lastName, specialty);
  };

  onBack = (): void => {
    this.router.navigate(['/iam/sign-in-home']).then();
  };
}