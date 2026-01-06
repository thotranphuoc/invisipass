import { Injectable, inject, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  
  // Chuyển đổi trạng thái user từ Observable sang Signal để dễ dùng ở UI
  user = toSignal(user(this.auth));

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      return await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Login failed', error);
      return null;
    }
  }

  async logout() {
    return await signOut(this.auth);
  }
}