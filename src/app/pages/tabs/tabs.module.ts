// src/app/pages/tabs/tabs.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'planets', loadChildren: () => import('../universe/planets/planets.module').then(m => m.PlanetsPageModule) },
      { path: 'world/:id', loadChildren: () => import('../world/world.module').then(m => m.WorldPageModule) },
      { path: 'favorites', loadChildren: () => import('../favorites/favorites.module').then(m => m.FavoritesPageModule) },
      { path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule) },
      { path: '', redirectTo: 'planets', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [IonicModule, CommonModule, RouterModule.forChild(routes), TabsPage]
})
export class TabsPageModule {}
