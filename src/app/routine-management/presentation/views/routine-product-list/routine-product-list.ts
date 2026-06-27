import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RoutineManagementStore } from '../../../application/routine-management.store';
import { RoutineItem } from '../../../domain/model/routine-item.entity';

interface WeekDay {
  date:        Date;
  dayNum:      number;
  dayName:     string;
  isToday:     boolean;
  isSelected:  boolean;
  isCompleted: boolean;
}

@Component({
  selector: 'app-routine-product-list',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './routine-product-list.html',
  styleUrl: './routine-product-list.css',
})
export class RoutineProductList {
  readonly store    = inject(RoutineManagementStore);
  protected router  = inject(Router);

  expandedProductId = signal<number | null>(null);
  selectedDate      = signal<Date>(new Date());

  readonly activeRoutineItems = this.store.activeRoutineItems;

  readonly selectedDayLabel = computed(() =>
    this.selectedDate().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' }),
  );

  readonly weekDays = computed((): WeekDay[] => {
    const today     = new Date();
    const dow       = today.getDay();
    const monday    = new Date(today);
    monday.setDate(today.getDate() - ((dow + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const selected  = this.selectedDate();
    const completed = this.store.completedDays();
    const pad       = (n: number) => String(n).padStart(2, '0');
    const toStr     = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        date:        d,
        dayNum:      d.getDate(),
        dayName:     d.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday:     d.toDateString() === today.toDateString(),
        isSelected:  d.toDateString() === selected.toDateString(),
        isCompleted: completed.includes(toStr(d)),
      };
    });
  });

  readonly isSelectedDayCompleted = computed(() => {
    const d   = this.selectedDate();
    const pad = (n: number) => String(n).padStart(2, '0');
    const str = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    return this.store.completedDays().includes(str);
  });

  selectDay(date: Date): void {
    this.selectedDate.set(date);
  }

  toggleDayCompletion(): void {
    const d   = this.selectedDate();
    const pad = (n: number) => String(n).padStart(2, '0');
    const str = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (this.isSelectedDayCompleted()) {
      this.store.markDayNotCompleted(str);
    } else {
      this.store.markDayCompleted(str);
    }
  }

  toggleProductExpand(itemId: number): void {
    this.expandedProductId.update(current => current === itemId ? null : itemId);
  }

  navigateToReplaceProduct(routineItem: RoutineItem): void {
    this.store.selectRoutine(this.store.activeRoutine()!);
    this.router.navigate(['/routine/product-replacement'], {
      queryParams: { routineItemId: routineItem.id },
    });
  }
}
