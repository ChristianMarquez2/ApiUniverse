// src/app/pages/auth/login/login.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: LoginPage }];

@NgModule({
  declarations: [],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), LoginPage]
})
export class LoginPageModule {}
