// email-verified.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class EmailVerifiedGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}
  async canActivate(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    await user?.reload();
    if (user && user.emailVerified) return true;
    this.router.navigateByUrl('/auth/verify-email');
    return false;
  }
}
