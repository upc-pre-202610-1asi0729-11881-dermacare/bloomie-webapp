import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
export class ScanResult implements OnInit {
  readonly store = inject(SkinAnalysisStore);
  private readonly routineStore = inject(RoutineManagementStore);
  protected router = inject(Router);

  readonly displayScore = signal<number>(0);

  readonly scoreMessage = computed((): string => {
    const s = this.store.currentScanAnalysis()?.overallScore ?? 0;
    if (s >= 80) return 'Your skin is looking great!';
    if (s >= 60) return 'Your skin is in good shape.';
    if (s >= 40) return 'Your skin could use some attention.';
    return 'Time to refresh your routine.';
  });

  readonly metrics = computed(() => {
    const a = this.store.currentScanAnalysis();
    if (!a) return [];
    return [
      { icon: 'water_drop',  labelKey: 'skinAnalysis.scanResult.hydration',   score: a.hydrationScore   },
      { icon: 'texture',     labelKey: 'skinAnalysis.scanResult.texture',      score: a.textureScore     },
      { icon: 'spa',         labelKey: 'skinAnalysis.scanResult.sensitivity',  score: a.sensitivityScore },
      { icon: 'wb_sunny',    labelKey: 'skinAnalysis.scanResult.brightness',   score: a.brightnessScore  },
    ];
  });

  ngOnInit(): void {
    const target = this.store.currentScanAnalysis()?.overallScore ?? 0;
    if (target === 0) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      this.displayScore.set(current);
      if (current >= target) clearInterval(id);
    }, 30);
  }

  onSaveAndDone(): void {
    this.routineStore.reloadRoutine();
    this.router.navigate(['/skin-analysis']);
  }

  navigateBack(): void {
    this.router.navigate(['/skin-analysis']);
  }
}
