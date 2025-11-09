import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  template: `
<ion-header translucent="true">
  <ion-toolbar class="hdr">
    <ion-title>Recuperar contraseña</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="space-bg">
  <div class="stars s1"></div><div class="stars s2"></div><div class="stars s3"></div>
  <div class="center">
    <div class="card">
      <h1>¿No recuerdas tu clave?</h1>
      <p class="sub">Te enviaremos un enlace a tu correo</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-item class="field">
          <ion-label position="stacked">Email</ion-label>
          <ion-input type="email" formControlName="email" autocomplete="username" placeholder="tu@email.com"></ion-input>
        </ion-item>
        <div class="err" *ngIf="submitted && form.controls.email.invalid">Ingresa un correo válido.</div>

        <ion-button class="btn" expand="block" type="submit" [disabled]="form.invalid || loading">
          <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
          <span *ngIf="!loading">Enviar enlace</span>
        </ion-button>
      </form>
    </div>
  </div>
</ion-content>
  `,
  styles: [`
.hdr { --background: transparent; --color: #eaf1ff; }
.space-bg { --background: linear-gradient(180deg,#06091a 0%,#030614 100%); position: relative; }
.stars{ position:absolute; inset:0; pointer-events:none; background:
  radial-gradient(2px 2px at 20% 30%, #fff, transparent 60%),
  radial-gradient(1px 1px at 60% 70%, #fff, transparent 60%),
  radial-gradient(1.5px 1.5px at 80% 20%, #fff, transparent 60%); opacity:.6; animation: blink 9s infinite ease-in-out; }
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
}
.card h1{ margin:4px 0 6px; font-size:22px; }
.card .sub{ margin:0 0 10px; opacity:.85; }
.field{ --background: rgba(255,255,255,.06); --border-radius: 12px; margin:10px 0; }
.err{ color:#ffb3b3; font-size:12px; margin:2px 2px 0 2px; }
.btn{ margin-top: 12px; }
  `]
})
export class ResetPage {
  submitted = false;
  loading = false;

  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });

  constructor(private fb: FormBuilder, private auth: AuthService, private toast: ToastController) {}

  async submit() {
    this.submitted = true;
    if (this.form.invalid) return;

    const email = this.form.controls.email.value!.trim().toLowerCase();
    this.loading = true;
    try {
      await this.auth.reset(email);
      (await this.toast.create({ message: 'Enlace enviado. Revisa tu correo 📬', duration: 1800, position:'bottom'})).present();
    } catch (e:any) {
      (await this.toast.create({ message: e?.message ?? 'No se pudo enviar el enlace', duration: 2000, color:'danger'})).present();
    } finally {
      this.loading = false;
    }
  }
}
