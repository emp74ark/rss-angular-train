import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { startServer } from '@planess/train-a-backend';

startServer().then(() => bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err)));
