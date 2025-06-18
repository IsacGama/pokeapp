import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules, RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideIonicAngular(), // Fundamental pra router do Ionic funcionar
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, // ESSENCIAL PRA EVITAR ESSE ERRO!
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});