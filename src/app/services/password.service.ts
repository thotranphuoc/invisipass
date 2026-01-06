import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { Auth, authState, User } from '@angular/fire/auth';
import { PasswordAccount } from '../models/password-account.interface';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  getPasswords(): Observable<PasswordAccount[]> {
    return authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          const colRef = collection(this.firestore, `users/${user.uid}/accounts`);
          const q = query(colRef, orderBy('createdAt', 'desc'));
          return collectionData(q, { idField: 'id' }) as Observable<PasswordAccount[]>;
        }
        return of([]);
      })
    );
  }

  async addAccount(account: any) {
    const user = this.auth.currentUser;
    if (!user) return;
    const colRef = collection(this.firestore, `users/${user.uid}/accounts`);
    return addDoc(colRef, { ...account, createdAt: new Date() });
  }

  async updateAccount(id: string, data: Partial<PasswordAccount>) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Unauthenticated');
    const docRef = doc(this.firestore, `users/${user.uid}/accounts/${id}`);
    return updateDoc(docRef, data);
  }

  async deleteAccount(id: string) {
    const user = this.auth.currentUser;
    if (!user) return;
    const docRef = doc(this.firestore, `users/${user.uid}/accounts/${id}`);
    return deleteDoc(docRef);
  }
}