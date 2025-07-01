// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // ✅ remplace HttpClientModule
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),           // ✅ nouvelle méthode recommandée
    provideRouter(routes)
  ]
})
.catch(err => console.error(err));
