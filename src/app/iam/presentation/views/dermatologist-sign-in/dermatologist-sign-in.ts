import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { IamStore } from '../../../application/iam.store';
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-dermatologist-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, MatIconModule, LanguageSwitcher],
  templateUrl: './dermatologist-sign-in.html',
  styleUrl: './dermatologist-sign-in.css',
})
export class DermatologistSignIn {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly iamStore = inject(IamStore);

  protected readonly showPassword = signal<boolean>(false);
  protected readonly submitted = signal<boolean>(false);

  protected readonly form = this.formBuilder.group({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  togglePasswordVisibility = (): void => {
    this.showPassword.update((value) => !value);
  };

  onSubmit = (): void => {
    this.submitted.set(true);
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();
    this.iamStore.login(email, password);
  };

  onBack = (): void => {
    this.router.navigate(['/iam/sign-in-home']).then();
  };
}
