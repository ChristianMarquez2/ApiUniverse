// src/app/pages/auth/verify-email/verify-email.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VerifyEmailPage } from './verify-email.page';

const routes: Routes = [{ path: '', component: VerifyEmailPage }];

@NgModule({
  declarations: [],
  imports: [IonicModule, CommonModule, RouterModule.forChild(routes), VerifyEmailPage]
})
export class VerifyEmailPageModule {}
