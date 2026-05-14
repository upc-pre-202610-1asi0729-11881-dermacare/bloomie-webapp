import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface NavItem {
  path: string;
  icon: string;
  labelKey: string;
}

/**
 * Application sidebar navigation component.
 * On desktop (≥1024px) it renders as a fixed left panel.
 * On mobile (<1024px) it slides in as a drawer triggered by a hamburger button.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  /** Controls whether the mobile drawer is open. */
  readonly isOpen = signal<boolean>(false);

  /** Navigation items displayed in the sidebar. */
  readonly navItems: NavItem[] = [
    { path: '/dashboard', icon: 'home', labelKey: 'nav.dashboard' },
    { path: '/consult', icon: 'smart_toy', labelKey: 'nav.aiAssistant' },
    { path: '/dermatology', icon: 'calendar_month', labelKey: 'nav.appointments' },
    { path: '/routine', icon: 'auto_awesome', labelKey: 'nav.myRoutine' },
    { path: '/skin-analysis', icon: 'photo_camera', labelKey: 'nav.skinScan' },
    { path: '/trending', icon: 'trending_up', labelKey: 'nav.trending' },
    { path: '/profile', icon: 'person', labelKey: 'nav.profile' },
  ];

  /** Opens the mobile sidebar drawer. */
  openSidebar(): void {
    this.isOpen.set(true);
  }

  /** Closes the mobile sidebar drawer. */
  closeSidebar(): void {
    this.isOpen.set(false);
  }
}
