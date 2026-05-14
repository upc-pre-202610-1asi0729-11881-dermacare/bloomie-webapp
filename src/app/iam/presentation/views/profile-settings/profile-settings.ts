import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';
import { UserRole } from '../../../domain/model/user.entity';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css',
})
export class ProfileSettings {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly iamStore = inject(IamStore);

  protected notifications = signal<boolean>(true);
  protected darkMode = signal<boolean>(false);
  protected language = signal<string>('en');
  protected saveSuccess = signal<boolean>(false);

  constructor() {
    this.language.set(this.translate.currentLang || 'en');
  }

  toggleNotifications(): void {
    this.notifications.update((v) => !v);
  }

  toggleDarkMode(): void {
    this.darkMode.update((v) => !v);
  }

  selectLanguage(lang: string): void {
    this.language.set(lang);
    this.translate.use(lang);
  }

  onSave(): void {
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 2000);
  }

  onBack(): void {
    const user = this.iamStore.currentUser();
    if (user?.role === UserRole.Dermatologist) {
      this.router.navigate(['/derm/profile']).then();
    } else {
      this.router.navigate(['/profile']).then();
    }
  }
}
