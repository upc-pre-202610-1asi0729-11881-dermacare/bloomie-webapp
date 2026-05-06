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
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly navItems: NavItem[] = [
    { path: '/dashboard',   icon: 'home',          labelKey: 'nav.dashboard'   },
    { path: '/consult',     icon: 'smart_toy',     labelKey: 'nav.aiAssistant' },
    { path: '/dermatology', icon: 'calendar_month',labelKey: 'nav.appointments'},
    { path: '/routine',     icon: 'auto_awesome',  labelKey: 'nav.myRoutine'   },
    { path: '/skin-scan',   icon: 'photo_camera',  labelKey: 'nav.skinScan'    },
    { path: '/products',    icon: 'trending_up',   labelKey: 'nav.trending'    },
    { path: '/profile',     icon: 'person',        labelKey: 'nav.profile'     },
  ];
}
