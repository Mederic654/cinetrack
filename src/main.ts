// src/main.ts — on ajoute l'intercepteur d'authentification
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './app/app';
import { authInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(App, {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
});