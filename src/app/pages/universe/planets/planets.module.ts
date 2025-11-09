// src/app/pages/universe/planets/planets.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PlanetsPage } from './planets.page';

const routes: Routes = [{ path: '', component: PlanetsPage }];

@NgModule({
  declarations: [],
  imports: [IonicModule, CommonModule, RouterModule.forChild(routes), PlanetsPage]
})
export class PlanetsPageModule {}
