// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}
  async canActivate(): Promise<boolean> {
    const user = await firstValueFrom(this.afAuth.authState);
    if (user) return true;
    this.router.navigateByUrl('/auth/login');
    return false;
  }
}
