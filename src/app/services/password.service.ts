import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  collectionData, 
  query, 
  where,
  serverTimestamp 
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { EncryptionService } from './encryption.service';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  // Sử dụng inject() thay cho constructor injection theo chuẩn Angular 21
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private encryptionService = inject(EncryptionService);

  // Thêm tài khoản mới (Mã hóa trước khi lưu)
  async addAccount(appPath: string, label: string, user: string, pass: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Chưa đăng nhập');

    // Thực hiện mã hóa qua EncryptionService
    const encryptedUser = this.encryptionService.encrypt(user);
    const encryptedPass = this.encryptionService.encrypt(pass);

    const path = `users/${currentUser.uid}/accounts`;
    const colRef = collection(this.firestore, path);

    return addDoc(colRef, {
      appPath,
      label,
      username: encryptedUser,
      password: encryptedPass,
      createdAt: serverTimestamp()
    });
  }


getAccounts() {
  const currentUser = this.auth.currentUser;
  if (!currentUser) return of([]); // trả về mảng rỗng khi chưa login

  const colRef = collection(this.firestore, `users/${currentUser.uid}/accounts`);
  const q = query(colRef); // BẮT BUỘC có dòng này

  // casting tạm để tránh check runtime giữa firebase/@angular/fire nếu vẫn còn mismatch
  return collectionData(q as unknown as any, { idField: 'id' });
}
}