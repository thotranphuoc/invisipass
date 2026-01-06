import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordService } from '../../services/password.service';
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss']
})
export class PasswordFormComponent {
  private fb = inject(FormBuilder);
  private passwordService = inject(PasswordService);
  private encryptionService = inject(EncryptionService);

  passwordForm: FormGroup = this.fb.group({
    label: ['', Validators.required],
    appPath: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  // Thêm hàm save() để khớp với lỗi TS2339 trong HTML
  async save() {
    if (this.passwordForm.invalid) return;

    // Kiểm tra xem đã mở khóa vault chưa trước khi mã hóa
    if (!this.encryptionService.getIsUnlocked()) {
      alert('Vui lòng mở khóa Vault trước khi thêm mật khẩu mới!');
      return;
    }

    try {
      const formValue = this.passwordForm.value;
      
      const encryptedData = {
        label: formValue.label,
        appPath: formValue.appPath,
        username: this.encryptionService.encrypt(formValue.username),
        password: this.encryptionService.encrypt(formValue.password),
        createdAt: new Date()
      };

      await this.passwordService.addAccount(encryptedData);
      this.passwordForm.reset();
      alert('Đã lưu mật khẩu an toàn!');
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      alert('Không thể lưu dữ liệu. Hãy kiểm tra lại kết nối.');
    }
  }
}