import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  template: `
<ion-header translucent="true">
  <ion-toolbar class="hdr">
    <ion-title>Verifica tu email</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="space-bg">
  <div class="stars s1"></div><div class="stars s2"></div>

  <div class="center">
    <div class="card">
      <h1>Último paso ✨</h1>
      <p class="sub">Te enviamos un correo. Verifícalo para continuar.</p>

      <ion-button expand="block" (click)="checkAndRedirect()" [disabled]="loading">
        <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
        <span *ngIf="!loading">Ya verifiqué</span>
      </ion-button>

      <ion-button expand="block" fill="clear" (click)="resend()" [disabled]="loading">
        Reenviar correo
      </ion-button>

      <p class="mini">Si no lo ves, revisa tu carpeta de spam.</p>
    </div>
  </div>
</ion-content>
  `,
  styles: [`
.hdr { --background: transparent; --color: #eaf1ff; }
.space-bg { --background: linear-gradient(180deg,#06091a 0%,#030614 100%); position: relative; }
.stars{ position:absolute; inset:0; pointer-events:none; background:
  radial-gradient(2px 2px at 25% 25%, #fff, transparent 60%),
  radial-gradient(1px 1px at 70% 50%, #fff, transparent 60%),
  radial-gradient(1.5px 1.5px at 40% 80%, #fff, transparent 60%); opacity:.6; animation: blink 9s infinite ease-in-out; }
@keyframes blink { 0%,100%{opacity:.9} 50%{opacity:.5} }

.center{ min-height: calc(100% - 56px); display:grid; place-items:center; padding:24px; }
.card{
  width:min(92vw, 440px);
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.04);
  backdrop-filter: blur(8px);
  color:#eaf1ff;
  padding: 18px 16px 14px;
  text-align:center;
}
.card h1{ margin:4px 0 6px; font-size:22px; }
.card .sub{ margin:0 0 10px; opacity:.85; }
.mini{ opacity:.75; margin-top:8px; font-size:12px; }
  `]
})
export class VerifyEmailPage { 
  loading = false;
  constructor(public auth: AngularFireAuth, private router: Router, private toast: ToastController) {}

  async checkAndRedirect() {
    this.loading = true;
    try {
      const user = await this.auth.currentUser;
      await user?.reload();
      if (user?.emailVerified) {
        (await this.toast.create({ message: '¡Verificación completada!', duration: 1200, position:'bottom'})).present();
        this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      } else {
        (await this.toast.create({ message: 'Tu email aún no está verificado.', duration: 1800 })).present();
      }
    } finally {
      this.loading = false;
    }
  }

  async resend() {
    this.loading = true;
    try {
      const user = await this.auth.currentUser;
      await user?.sendEmailVerification();
      (await this.toast.create({ message: 'Correo reenviado ✅', duration: 1400, position:'bottom'})).present();
    } catch (e:any) {
      (await this.toast.create({ message: e?.message ?? 'No se pudo reenviar', duration: 1800, color:'danger'})).present();
    } finally {
      this.loading = false;
    }
  }
}
