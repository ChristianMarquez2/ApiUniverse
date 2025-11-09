import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
<ion-header translucent="true">
  <ion-toolbar class="hdr">
    <ion-title>APIverse</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="space-bg">
  <div class="stars s1"></div><div class="stars s2"></div><div class="stars s3"></div>
  <div class="comet c1"></div><div class="comet c2"></div>

  <div class="center">
    <div class="card">
      <h1>Bienvenido 👋</h1>
      <p class="sub">Ingresa para explorar el universo de APIs</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-item class="field">
          <ion-label position="stacked">Email</ion-label>
          <ion-input
            formControlName="email"
            type="email"
            autocomplete="username"
            inputmode="email"
            placeholder="tu@email.com">
          </ion-input>
        </ion-item>
        <div class="err" *ngIf="submitted && form.controls.email.invalid">
          Ingresa un correo válido.
        </div>

        <ion-item class="field">
          <ion-label position="stacked">Contraseña</ion-label>
          <ion-input
            [type]="showPwd ? 'text' : 'password'"
            formControlName="pass"
            autocomplete="current-password"
            placeholder="••••••••">
          </ion-input>
          <ion-button slot="end" size="small" fill="clear" (click)="showPwd = !showPwd" type="button">
            {{ showPwd ? 'Ocultar' : 'Ver' }}
          </ion-button>
        </ion-item>
        <div class="err" *ngIf="submitted && form.controls.pass.invalid">
          La contraseña es obligatoria.
        </div>

        <ion-button class="btn" expand="block" type="submit" [disabled]="form.invalid || loading">
          <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
          <span *ngIf="!loading">Entrar</span>
        </ion-button>
      </form>

      <div class="links">
        <a routerLink="/auth/register">Crear cuenta</a>
        <a routerLink="/auth/reset">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
</ion-content>
  `,
  styles: [`
/* Header */
.hdr { --background: transparent; --color: #eaf1ff; }

/* Fondo espacial */
.space-bg { --background: linear-gradient(180deg,#06091a 0%,#030614 100%); position: relative; }
.stars{ position:absolute; inset:0; pointer-events:none; }
.s1{ background: radial-gradient(2px 2px at 20% 30%, #fff, transparent 60%),
               radial-gradient(1px 1px at 60% 70%, #fff, transparent 60%),
               radial-gradient(1.5px 1.5px at 80% 20%, #fff, transparent 60%); opacity:.7; animation: blink 8s infinite ease-in-out; }
.s2{ background: radial-gradient(1.5px 1.5px at 30% 80%, #fff, transparent 60%),
               radial-gradient(1px 1px at 70% 40%, #fff, transparent 60%),
               radial-gradient(2px 2px at 90% 60%, #fff, transparent 60%); opacity:.55; animation: blink 10s infinite ease-in-out 1s; }
.s3{ background: radial-gradient(1px 1px at 10% 60%, #fff, transparent 60%),
               radial-gradient(1px 1px at 50% 20%, #fff, transparent 60%),
               radial-gradient(1.5px 1.5px at 40% 50%, #fff, transparent 60%); opacity:.4; animation: blink 12s infinite ease-in-out 2s; }
@keyframes blink { 0%,100%{opacity:.9} 50%{opacity:.5} }

.comet{ position:absolute; width:2px; height:2px; background:#fff; border-radius:999px; filter:drop-shadow(0 0 6px #fff); opacity:.9; }
.comet::after{ content:''; position:absolute; right:2px; top:1px; width:160px; height:2px;
  background: linear-gradient(90deg,#fff,transparent); transform: skewY(-8deg); }
.c1{ top:-10%; left:8%; animation: fly 14s linear infinite; }
.c2{ top:-20%; left:60%; animation: fly 18s linear infinite 4s; }
@keyframes fly{ 0%{transform:translate(0,0) rotate(-25deg);opacity:0} 5%{opacity:.9} 100%{transform:translate(120vw,120vh) rotate(-25deg);opacity:0} }

/* Layout */
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

/* Inputs */
.field{ --background: rgba(255,255,255,.06); --border-radius: 12px; margin:10px 0; }
.err{ color:#ffb3b3; font-size:12px; margin:2px 2px 0 2px; }
.btn{ margin-top: 12px; }

/* Links */
.links{ display:flex; justify-content:space-between; gap:10px; margin-top:12px; }
.links a{ color:#a9c7ff; text-decoration:none; font-weight:600; }
.links a:hover{ text-decoration:underline; }
  `]
})
export class LoginPage {
  submitted = false;
  loading = false;
  showPwd = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  async submit() {
    this.submitted = true;
    if (this.form.invalid) return;

    const email = this.form.controls.email.value!.trim().toLowerCase();
    const pass  = this.form.controls.pass.value!;
    this.loading = true;
    try {
      await this.auth.login(email, pass);
      (await this.toast.create({ message: '¡Bienvenido!', duration: 1200, position: 'bottom'})).present();
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (e:any) {
      (await this.toast.create({ message: e?.message ?? 'Error al iniciar sesión', duration: 1800, color:'danger'})).present();
    } finally {
      this.loading = false;
    }
  }
}
