import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNgxSkeletonLoader } from 'ngx-skeleton-loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_BASE_URL } from './core/config/api.config';
import { baseUrlInterceptor } from './core/interceptors/base-url.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { locationsReducer, LocationsEffects } from './store/locations';
import { childrenReducer, ChildrenEffects } from './store/children';
import { assignmentsReducer, AssignmentsEffects } from './store/assignments';
import { planningsReducer, PlanningsEffects } from './store/plannings';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

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
    provideStore({
      locations: locationsReducer,
      children: childrenReducer,
      assignments: assignmentsReducer,
      plannings: planningsReducer,
    }),
    provideEffects([LocationsEffects, ChildrenEffects, AssignmentsEffects, PlanningsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
