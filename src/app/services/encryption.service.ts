import { Injectable, signal } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private passcode = signal<string | null>(null);
  private lockTimer: any;

  setPasscode(code: string) {
    this.passcode.set(code);
    
    // Auto-lock: Xóa passcode sau 5 phút để bảo mật
    if (this.lockTimer) clearTimeout(this.lockTimer);
    this.lockTimer = setTimeout(() => {
      this.passcode.set(null);
      console.log('Vault auto-locked');
    }, 5 * 60 * 1000); 
  }

  getIsUnlocked() {
    return !!this.passcode();
  }

  decrypt(cipherText: string): string {
    const code = this.passcode();
    if (!code) return '********'; // Trả về mask nếu chưa unlock
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, code);
      return bytes.toString(CryptoJS.enc.Utf8) || 'Error';
    } catch {
      return 'Decryption Failed';
    }
  }

  encrypt(plainText: string): string {
    const code = this.passcode();
    if (!code) throw new Error('No passcode set');
    return CryptoJS.AES.encrypt(plainText, code).toString();
  }
}