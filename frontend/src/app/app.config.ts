import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNgxSkeletonLoader } from 'ngx-skeleton-loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_BASE_URL } from './core/config/api.config';
import { baseUrlInterceptor } from './core/interceptors/base-url.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([baseUrlInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgxSkeletonLoader({
      theme: {
        extendsFromRoot: true,
        height: '30px',
      },
    }),
    { provide: API_BASE_URL, useValue: 'http://localhost:8080/api' },
  ],
};
