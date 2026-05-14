import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

interface Plan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  icon: string;
  color: string;
  textColor: string;
  features: string[];
}

@Component({
  selector: 'app-my-plan',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './my-plan.html',
  styleUrl: './my-plan.css',
})
export class MyPlan {
  private readonly router = inject(Router);

  protected showCancelModal = signal<boolean>(false);
  protected showChangePlan = signal<boolean>(false);
  protected selectedNewPlan = signal<string | null>(null);
  protected cancelConfirmed = signal<boolean>(false);

  readonly currentPlanId = 'advanced';

  readonly plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'Introduction to personalized care',
      price: 9,
      icon: 'star',
      color: '#cebebe',
      textColor: '#a26769',
      features: [
        'Up to 5 monthly skin analyses',
        'General product recommendations',
        'Access to product catalog',
        'Basic chatbot (FAQ)',
        'Limited history (last 3 analyses)',
      ],
    },
    {
      id: 'advanced',
      name: 'Advanced',
      tagline: 'Personalization & continuous tracking',
      price: 19,
      icon: 'bolt',
      color: '#a26769',
      textColor: '#ffffff',
      features: [
        'Unlimited facial skin analyses',
        'AI-generated personalized routines',
        'Full history & progress tracking',
        'Dermatologist directory access',
        'Smart chatbot with memory',
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      tagline: 'Advanced & preventive dermatological care',
      price: 39,
      icon: 'workspace_premium',
      color: '#333333',
      textColor: '#ffffff',
      features: [
        'Priority dermatology consultations',
        'Exportable clinical reports',
        'Dynamic routines (weather adapted)',
        'Smart notifications & reminders',
        'All Advanced features included',
      ],
    },
  ];

  get currentPlan(): Plan {
    return this.plans.find((p) => p.id === this.currentPlanId)!;
  }

  get otherPlans(): Plan[] {
    return this.plans.filter((p) => p.id !== this.currentPlanId);
  }

  isUpgrade(plan: Plan): boolean {
    return plan.price > this.currentPlan.price;
  }

  onSelectPlan(planId: string): void {
    this.selectedNewPlan.set(planId);
  }

  onConfirmChangePlan(): void {
    this.showChangePlan.set(false);
    this.selectedNewPlan.set(null);
  }

  onOpenCancelModal(): void {
    this.showCancelModal.set(true);
    this.cancelConfirmed.set(false);
  }

  onCloseCancelModal(): void {
    this.showCancelModal.set(false);
    this.cancelConfirmed.set(false);
  }

  onConfirmCancel(): void {
    this.cancelConfirmed.set(true);
  }

  onBack(): void {
    this.router.navigate(['/profile']).then();
  }
}
