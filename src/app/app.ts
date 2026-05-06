import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Layout } from './shared/presentation/components/layout/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor() {
    const translate = inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
