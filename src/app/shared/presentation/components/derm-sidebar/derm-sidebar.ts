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
 * Dermatologist portal sidebar navigation component.
 *
 * On desktop (≥1024px) it renders as a fixed left panel always visible.
 * On mobile (<1024px) it collapses off-screen and can be revealed via
 * a floating hamburger button. An overlay dims the rest of the screen
 * while the drawer is open and closes it when tapped.
 */
@Component({
  selector: 'app-derm-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslateModule],
  templateUrl: './derm-sidebar.html',
  styleUrl: './derm-sidebar.css',
})
export class DermSidebar {
  /** Controls whether the mobile drawer is currently open. */
  readonly isOpen = signal<boolean>(false);

  /** Navigation items shown in the dermatologist portal sidebar. */
  readonly navItems: NavItem[] = [
    { path: '/derm/agenda', icon: 'calendar_month', labelKey: 'derm.nav.agenda' },
    { path: '/derm/past-consultations', icon: 'history', labelKey: 'derm.nav.pastConsultations' },
    { path: '/derm/profile', icon: 'person', labelKey: 'derm.nav.profile' },
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
