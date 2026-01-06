import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { PasswordAccount } from '../models/password-account.interface'; // Import interface

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  getAccounts(): Observable<PasswordAccount[]> {
    const user = this.auth.currentUser;
    if (!user) return of([]);

    const colRef = collection(this.firestore, `users/${user.uid}/accounts`);
    const q = query(colRef);
    
    // Ép kiểu dữ liệu trả về từ Firestore thành mảng PasswordAccount
    return collectionData(q, { idField: 'id' }) as Observable<PasswordAccount[]>;
  }

  // Cập nhật hàm addAccount để dùng interface
  addAccount(data: Omit<PasswordAccount, 'id' | 'createdAt'>) {
    const user = this.auth.currentUser;
    if (!user) return;

    const colRef = collection(this.firestore, `users/${user.uid}/accounts`);
    return addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp()
    });
  }
}