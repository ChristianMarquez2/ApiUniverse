// src/app/pages/auth/register/register.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPage } from './register.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: RegisterPage }];

@NgModule({
  declarations: [],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), RegisterPage]
})
export class RegisterPageModule {}
