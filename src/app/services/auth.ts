// auth.service.ts (compat)
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}
  private mapFirebaseError(e: any) {
    const code = e?.code || e?.status || '';
    const map: Record<string, string> = {
      'auth/operation-not-allowed': 'El método de inicio de sesión está deshabilitado en el proyecto de Firebase. Habilítalo en Firebase Console → Authentication → Sign-in method (habilita Email/Password).',
      'auth/invalid-email': 'El correo electrónico no es válido.',
      'auth/user-disabled': 'La cuenta de usuario ha sido deshabilitada.',
      'auth/user-not-found': 'No se encontró una cuenta con ese correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/email-already-in-use': 'El correo ya está en uso por otra cuenta.',
      'auth/weak-password': 'La contraseña es muy débil. Usa una contraseña más segura.'
    };
    return map[code] || e?.message || String(e);
  }

  async register(email: string, pass: string) {
    try {
      const cred = await this.afAuth.createUserWithEmailAndPassword(email, pass);
      await cred.user?.sendEmailVerification();
      return cred;
    } catch (e:any) {
      throw new Error(this.mapFirebaseError(e));
    }
  }

  async login(email: string, pass: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, pass);
    } catch (e:any) {
      throw new Error(this.mapFirebaseError(e));
    }
  }

  async reset(email: string) {
    try {
      return await this.afAuth.sendPasswordResetEmail(email);
    } catch (e:any) {
      throw new Error(this.mapFirebaseError(e));
    }
  }

  logout() {
    return this.afAuth.signOut();
  }

  currentUser() {
    return this.afAuth.currentUser; // Promise<User | null>
  }
}
