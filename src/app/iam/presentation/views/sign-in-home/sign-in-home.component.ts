import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in-home',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './sign-in-home.component.html',
  styleUrl: './sign-in-home.component.css',
})
export class SignInHomeComponent {
  private readonly router = inject(Router);

  onLogin = (): void => {
    this.router.navigate(['/iam/sign-in']).then();
  };

  onSignUp = (): void => {
    this.router.navigate(['/iam/sign-up']).then();
  };

  onDermatologistLogin = (): void => {
    this.router.navigate(['/iam/dermatologist-sign-in']).then();
  };

  onDermatologistRegister = (): void => {
    this.router.navigate(['/iam/dermatologist-sign-up']).then();
  };
}
