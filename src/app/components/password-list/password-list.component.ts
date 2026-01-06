import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PasswordService } from '../../services/password.service';
import { EncryptionService } from '../../services/encryption.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { PasscodeDialogComponent } from '../passcode-dialog/passcode-dialog.component';

@Component({
  selector: 'app-password-list',
  standalone: true,
  // Import đầy đủ các module tại đây
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './password-list.component.html',
  styleUrl: './password-list.component.scss'
})
export class PasswordListComponent {
  private passwordService = inject(PasswordService);
  private encryptionService = inject(EncryptionService);
  private dialog = inject(MatDialog);

// TypeScript sẽ tự hiểu kiểu dữ liệu nhờ định nghĩa trong Service
  accounts = toSignal(this.passwordService.getAccounts(), { initialValue: [] });
  isLocked = computed(() => this.encryptionService.getIsLocked());

  decrypt(cipherText: string) {
    return this.encryptionService.decrypt(cipherText);
  }

  requestUnlock() {
  this.dialog.open(PasscodeDialogComponent, {
    width: 'auto', // Để nó tự co giãn theo nội dung
    maxWidth: '95vw',
    hasBackdrop: true,
    backdropClass: 'blur-backdrop' // Dùng để làm mờ nền
  });
}

  lockVault() {
    this.encryptionService.lock();
  }

  copy(text: string) {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }
}

export interface PasswordAccount {
  id?: string;
  appPath: string;
  label: string;
  username: string;
  password: string;
  createdAt?: any;
}