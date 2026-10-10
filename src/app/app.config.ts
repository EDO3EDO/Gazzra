import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideNgReflectAttributes, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFirestore, provideFirestore  } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideNgReflectAttributes(),
    provideFirebaseApp(() => initializeApp({
  apiKey: "AIzaSyC53iJfMDacOD3Igs9086Ek-mMuzDLQeyw",
  authDomain: "gazzra-e0f3c.firebaseapp.com",
  projectId: "gazzra-e0f3c",
  storageBucket: "gazzra-e0f3c.firebasestorage.app",
  messagingSenderId: "1093264638469",
  appId: "1:1093264638469:web:b3c600ddb1012e1c50526c",
  measurementId: "G-CFMTDMTK54"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
};

