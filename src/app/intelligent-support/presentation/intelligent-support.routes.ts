
import { Routes } from '@angular/router';

const aiChat = () => import('./views/ai-chat/ai-chat').then((m) => m.AiChat);

/**
 * Route tree for intelligent support views — under /consult.
 */
export const intelligentSupportRoutes: Routes = [{ path: '', loadComponent: aiChat }];
