import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-lifestyle-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe, MatIcon],
  templateUrl: './lifestyle-form.html',
  styleUrl: './lifestyle-form.css',
})
export class LifestyleForm {
  private readonly router = inject(Router);

  protected readonly skinType = signal<string>('');
  protected readonly waterIntake = signal<string>('');
  protected readonly sunExposure = signal<string>('');
  protected readonly sleepHabits = signal<string>('');
  protected readonly guideOpen = signal<boolean>(false);

  protected readonly step = 0;
  protected readonly totalSteps = 4;

  readonly skinTypeOptions = ['Normal', 'Dry', 'Oily', 'Combination Skin'];

  readonly waterOptions = [
    '0-2 glasses',
    '3-5 glasses',
    '6-8 glasses',
    'More than 8',
  ];

  readonly sunOptions = [
    'Less than 30 min',
    '30-60 minutes',
    '1-2 hours',
    'More than 2 hours',
  ];

  readonly sleepOptions = [
    'Less than 6 hours',
    '6-7 hours',
    '8 hours',
    'More than 8 hours',
  ];

  openGuide(): void {
    this.guideOpen.set(true);
  }

  closeGuide(): void {
    this.guideOpen.set(false);
  }

  onNext(): void {
    this.router.navigate(['/dashboard']).then();
  }

  onBack(): void {
    this.router.navigate(['/iam/sign-up']).then();
  }
}