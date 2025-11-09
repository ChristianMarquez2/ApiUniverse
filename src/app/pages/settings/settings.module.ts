// src/app/pages/settings/settings.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SettingsPage } from './settings.page'; // 👈 IMPORT *nombrado* (no default)

const routes: Routes = [
  { path: '', component: SettingsPage }
];

@NgModule({
  // 👇 NADA en declarations porque SettingsPage es standalone
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SettingsPage // 👈 se importa el componente standalone
  ],
})
export class SettingsPageModule {}
