import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';

interface Plan {
  id: string;
  name: string;
  taglineKey: string;
  price: number;
  icon: string;
  color: string;
  textColor: string;
  featureKeys: string[];
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
  private readonly iamStore = inject(IamStore);

  protected showCancelModal = signal<boolean>(false);
  protected showChangePlan = signal<boolean>(false);
  protected selectedNewPlan = signal<string | null>(null);
  protected cancelConfirmed = signal<boolean>(false);

  readonly currentPlanId = 'advanced';

  readonly cardLast4 = '4242';
  readonly cardExpiry = '08/2028';
  readonly billingDate = 'June 1, 2026';

  readonly currentUserFullName = computed((): string => {
    const user = this.iamStore.currentUser();
    return user ? `${user.name} ${user.lastName}` : '';
  });

  readonly plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      taglineKey: 'iam.myPlan.plans.starter.tagline',
      price: 9,
      icon: 'star',
      color: '#cebebe',
      textColor: '#a26769',
      featureKeys: [
        'iam.myPlan.plans.starter.f1',
        'iam.myPlan.plans.starter.f2',
        'iam.myPlan.plans.starter.f3',
        'iam.myPlan.plans.starter.f4',
        'iam.myPlan.plans.starter.f5',
      ],
    },
    {
      id: 'advanced',
      name: 'Advanced',
      taglineKey: 'iam.myPlan.plans.advanced.tagline',
      price: 19,
      icon: 'bolt',
      color: '#a26769',
      textColor: '#ffffff',
      featureKeys: [
        'iam.myPlan.plans.advanced.f1',
        'iam.myPlan.plans.advanced.f2',
        'iam.myPlan.plans.advanced.f3',
        'iam.myPlan.plans.advanced.f4',
        'iam.myPlan.plans.advanced.f5',
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      taglineKey: 'iam.myPlan.plans.elite.tagline',
      price: 39,
      icon: 'workspace_premium',
      color: '#333333',
      textColor: '#ffffff',
      featureKeys: [
        'iam.myPlan.plans.elite.f1',
        'iam.myPlan.plans.elite.f2',
        'iam.myPlan.plans.elite.f3',
        'iam.myPlan.plans.elite.f4',
        'iam.myPlan.plans.elite.f5',
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
