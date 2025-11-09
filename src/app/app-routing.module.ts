// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { EmailVerifiedGuard } from './guards/email-verified-guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    children: [
      { path: 'login', loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule) },
      { path: 'register', loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterPageModule) },
      { path: 'verify-email', loadChildren: () => import('./pages/auth/verify-email/verify-email.module').then(m => m.VerifyEmailPageModule) },
      { path: 'reset', loadChildren: () => import('./pages/auth/reset/reset.module').then(m => m.ResetPageModule) },
    ]
  },

  {
    path: 'tabs',
    canActivate: [AuthGuard, EmailVerifiedGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },

  { path: '**', redirectTo: 'tabs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
