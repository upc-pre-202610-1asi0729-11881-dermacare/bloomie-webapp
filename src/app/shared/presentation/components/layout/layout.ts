import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { Sidebar } from '../sidebar/sidebar';

/**
 * Application shell that wraps every routed view with the sidebar,
 * the top bar, and the main content area.
 *
 * @remarks
 * The shell hides the sidebar and the top bar when the active route belongs
 * to the IAM bounded context (`/iam/...`), so authentication views can be
 * rendered as full-screen experiences without surrounding chrome.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, LanguageSwitcher, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly router = inject(Router);

  /**
   * Reactive signal that emits the URL of the active route after every
   * successful navigation. Initialised with the current router URL so the
   * shell decides correctly on the very first render.
   */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /**
   * Computed flag that resolves to true when the user is navigating
   * within the IAM bounded context.
   */
  readonly isAuthenticationRoute = computed(() => this.currentUrl().startsWith('/iam'));
}
