import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({"projectId":"app-bus-barcelona","appId":"1:260236005776:web:5db6577576f7661702e315","storageBucket":"app-bus-barcelona.appspot.com","apiKey":"AIzaSyCcX1PIyoBrmJq5OeIwwwH8Sv1SICuKBno","authDomain":"app-bus-barcelona.firebaseapp.com","messagingSenderId":"260236005776","measurementId":"G-7HQ72G7MJW"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
});
