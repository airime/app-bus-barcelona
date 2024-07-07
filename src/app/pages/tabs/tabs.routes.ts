import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tab1',
      },
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then(m => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then(m => m.Tab2Page),
      },
      { path: '**', pathMatch: 'full', 
        loadComponent: () => import('../pagenotfound/pagenotfound.page').then( m => m.PagenotfoundPage)
      }
    ],
  },
];
