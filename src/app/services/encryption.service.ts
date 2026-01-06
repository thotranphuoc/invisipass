import { Injectable, signal, effect } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  // Signal lưu passcode. Nếu là null nghĩa là app đang 'Locked' (Tàng hình)
  private passcode = signal<string | null>(null);

  constructor() {
    // Tự động xóa passcode sau 5 phút kể từ khi nó được set
    effect((onCleanup) => {
      const code = this.passcode();
      if (code) {
        const timer = setTimeout(() => {
          this.lock();
          console.log('Invisipass: Auto-locked after 5 mins.');
        }, 300000); // 5 phút

        onCleanup(() => clearTimeout(timer));
      }
    });
  }

  setPasscode(code: string) {
    this.passcode.set(code);
  }

  lock() {
    this.passcode.set(null);
  }

  getIsLocked() {
    return !this.passcode();
  }

  getPasscode() {
    return this.passcode();
  }

  encrypt(plainText: string): string {
    const key = this.passcode();
    if (!key) throw new Error('Cần nhập Passcode trước khi lưu!');
    return CryptoJS.AES.encrypt(plainText, key).toString();
  }

  decrypt(cipherText: string): string {
    const key = this.passcode();
    if (!key) return '******'; 
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, key);
      return bytes.toString(CryptoJS.enc.Utf8) || 'ERR: Sai Passcode';
    } catch {
      return 'ERR: Giải mã lỗi';
    }
  }
}