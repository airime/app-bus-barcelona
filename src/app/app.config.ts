import { ApplicationConfig, ErrorHandler, NgZone } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from "@angular/common/http";
import { ErrorService } from './shared/services/exceptionHandler.service';
import { apiKeyFirebase } from './api.key';


export const appConfig: ApplicationConfig = {
    providers: [
        { provide: ErrorHandler, useClass: ErrorService },
        provideIonicAngular(),
        provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideFirebaseApp(() => initializeApp({ "projectId": "app-bus-barcelona",
        "appId": "1:260236005776:web:5db6577576f7661702e315", "storageBucket": "app-bus-barcelona.appspot.com",
        "apiKey": apiKeyFirebase,
        "authDomain": "app-bus-barcelona.firebaseapp.com",
        "messagingSenderId": "260236005776", "measurementId": "G-7HQ72G7MJW" })),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideHttpClient(),
    ]
  };
