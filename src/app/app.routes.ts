import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate, emailVerified } from '@angular/fire/auth-guard';
import { map, pipe } from 'rxjs';
import { LoginPage } from './pages/auth/login/login.page';
import { ProfilePage } from './pages/auth/profile/profile.page';
import { RegisterPage } from './pages/auth/register/register.page';
import { RecoveryPage } from './pages/auth/recovery/recovery.page';
import { ServiceTermsPage } from './pages/auth/service-terms/service-terms.page';

const redirectUnauthorizedToLogin = () =>  redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['private/home']);
const redirectUnverifiedToProfile = () => redirectUnverifiedTo(['user-profile']);

const redirectUnverifiedTo = (redirect: any[]) => pipe(emailVerified, map(emailVerified => emailVerified || redirect));


export const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'private/home'
  },
  { path: 'login', component: LoginPage, ...canActivate(redirectLoggedInToHome) },
  { 
    path: 'user-profile',
      loadComponent: () => import('./pages/auth/profile/profile.page').then(m => m.ProfilePage),
      ...canActivate(redirectUnauthorizedToLogin) },
  { 
    path: 'change-email',
      loadComponent: () => import('./pages/auth/change-email/change-email.page').then(m => m.ChangeEmailPage),
      ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'change-password',
      loadComponent: () => import('./pages/auth/recovery/recovery.page').then(m => m.RecoveryPage),
      ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'resend-verification',
    loadComponent: () => import('./pages/auth/resend-verification/resend-verification.page').then( m => m.ResendVerificationPage),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'private', ...canActivate(redirectUnverifiedToProfile), children: [
      {
        path: 'home', loadChildren: () => import('./pages/tabs/tabs.routes').then(m => m.routes)
      },
      { path: '**', pathMatch: 'full', 
          loadComponent: () => import('./pages/pagenotfound/pagenotfound.page').then( m => m.PagenotfoundPage)
      },
    ]
  },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.page').then(m => m.RegisterPage) },
  { path: 'service-terms', loadComponent: () => import('./pages/auth/service-terms/service-terms.page').then(m => m.ServiceTermsPage) },
  { path: 'recovery', loadComponent: () => import('./pages/auth/recovery/recovery.page').then(m => m.RecoveryPage) },
  { path: 'tabs', loadComponent: () => import('./pages/tab1/tab1.page').then(m => m.Tab1Page) },
  /*
  { path: 'aboutus', component: AboutusComponent },
  */
  { path: '**', pathMatch: 'full', 
    loadComponent: () => import('./pages/pagenotfound/pagenotfound.page').then( m => m.PagenotfoundPage)
  },
  {
    path: 'tab3',
    loadComponent: () => import('./pages/tab3/tab3.page').then( m => m.Tab3Page)
  },
];
