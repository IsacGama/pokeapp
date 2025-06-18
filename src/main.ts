import { bootstrapApplication } from '@angular/platform-browser';
import {  provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import {  provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
  
});
