// src/app/pages/auth/reset/reset.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResetPage } from './reset.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: ResetPage }];

@NgModule({
  declarations: [],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), ResetPage]
})
export class ResetPageModule {}
