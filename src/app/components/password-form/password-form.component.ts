import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PasswordService } from '../../services/password.service';
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss'
})
export class PasswordFormComponent {
  private passwordService = inject(PasswordService);
  private encryptionService = inject(EncryptionService);

  appPath = '';
  label = '';
  username = '';
  password = '';
  userPasscode = '';

  async save() {
    // Tạm thời set passcode để thực hiện mã hóa
    this.encryptionService.setPasscode(this.userPasscode);

    try {
      await this.passwordService.addAccount(
        this.appPath, 
        this.label, 
        this.username, 
        this.password
      );
      
      // Reset form sau khi lưu thành công
      this.appPath = ''; 
      this.label = ''; 
      this.username = ''; 
      this.password = ''; 
      this.userPasscode = '';
      
      alert('Đã lưu mật khẩu tàng hình thành công!');
    } catch (e) {
      alert('Lỗi: ' + e);
    }
  }
}