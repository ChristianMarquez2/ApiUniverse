// src/app/pages/tabs/tabs.page.ts
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-tabs',
  template: `
<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="planets" [routerLink]="['/tabs/planets']">
      <ion-icon name="planet"></ion-icon><ion-label>Universo</ion-label>
    </ion-tab-button>
    <ion-tab-button tab="favorites" [routerLink]="['/tabs/favorites']">
      <ion-icon name="star"></ion-icon><ion-label>Favoritos</ion-label>
    </ion-tab-button>
    <ion-tab-button tab="settings" [routerLink]="['/tabs/settings']">
      <ion-icon name="settings"></ion-icon><ion-label>Ajustes</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
`,
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class TabsPage {}
