import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

// Modify the appConfig to include provideHttpClient
bootstrapApplication(AppComponent, {
  ...appConfig,  // Spread existing configuration from appConfig
  providers: [
    provideHttpClient(), // Add provideHttpClient here
    ...(appConfig.providers || []),  // Include any existing providers from appConfig
  ],
}).catch((err) => console.error(err));
