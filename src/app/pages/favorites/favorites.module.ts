// src/app/pages/favorites/favorites.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesPage } from './favorites.page';

const routes: Routes = [{ path: '', component: FavoritesPage }];

@NgModule({
  declarations: [],
  imports: [IonicModule, CommonModule, RouterModule.forChild(routes), FavoritesPage]
})
export class FavoritesPageModule {}
