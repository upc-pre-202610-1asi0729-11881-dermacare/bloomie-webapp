import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface NavItem {
  path: string;
  icon: string;
  labelKey: string;
}

@Component({
  selector: 'app-derm-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslateModule],
  templateUrl: './derm-sidebar.html',
  styleUrl: './derm-sidebar.css',
})
export class DermSidebar {
  readonly navItems: NavItem[] = [
    { path: '/derm/agenda',              icon: 'calendar_month', labelKey: 'derm.nav.agenda'            },
    { path: '/derm/past-consultations',  icon: 'history',        labelKey: 'derm.nav.pastConsultations' },
    { path: '/derm/profile',             icon: 'person',         labelKey: 'derm.nav.profile'           },
  ];
}
