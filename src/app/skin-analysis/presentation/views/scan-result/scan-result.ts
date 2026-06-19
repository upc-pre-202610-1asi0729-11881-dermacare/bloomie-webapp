import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SkinAnalysisStore } from '../../../application/skin-analysis.store';
import { RoutineManagementStore } from '../../../../routine-management/application/routine-management.store';

@Component({
  selector: 'app-scan-result',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './scan-result.html',
  styleUrl: './scan-result.css',
})
export class ScanResult {
  readonly store = inject(SkinAnalysisStore);
  private readonly routineStore = inject(RoutineManagementStore);
  protected router = inject(Router);

  onSaveAndDone(): void {
    this.routineStore.reloadRoutine();
    this.router.navigate(['/skin-analysis']);
  }

  navigateBack(): void {
    this.router.navigate(['/skin-analysis']);
  }
}
