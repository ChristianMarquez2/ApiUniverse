// src/app/app.component.ts
import { Component, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class AppComponent {
  dark = true;
  constructor(@Inject(DOCUMENT) private doc: Document, private renderer: Renderer2) {
    this.toggleDark(true);
  }
  toggleDark(val: boolean) {
    this.dark = val;
    if (val) this.renderer.setAttribute(this.doc.body, 'color-theme', 'dark');
    else this.renderer.removeAttribute(this.doc.body, 'color-theme');
  }
}
