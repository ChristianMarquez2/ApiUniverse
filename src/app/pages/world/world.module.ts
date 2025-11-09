// src/app/pages/world/world.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorldPage } from './world.page';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: WorldPage }];

@NgModule({
  declarations: [],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), WorldPage]
})
export class WorldPageModule {}
