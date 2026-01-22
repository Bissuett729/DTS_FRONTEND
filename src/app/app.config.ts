import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/infrastructure/interceptors/auth.interceptor';
import { AuthRepository } from './core/domain/repositories/auth.repository';
import { AuthApiRepository } from './core/infrastructure/repositories/auth-api.repository';
import { StorageRepository } from './core/domain/repositories/storage.repository';
import { LocalStorageRepository } from './core/infrastructure/repositories/local-storage.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    { provide: AuthRepository, useClass: AuthApiRepository },
    { provide: StorageRepository, useClass: LocalStorageRepository }
  ]
};
