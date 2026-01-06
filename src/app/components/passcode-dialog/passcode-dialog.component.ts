import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-passcode-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './passcode-dialog.component.html',
  styleUrl: './passcode-dialog.component.scss'
})
export class PasscodeDialogComponent {
  digits = ['', '', '', '', '', ''];
  @ViewChildren('inputBox') inputs!: QueryList<ElementRef>;

  constructor(private dialogRef: MatDialogRef<PasscodeDialogComponent>) {}

  // Sửa tại passcode-dialog.component.ts
onInput(event: any, index: number) {
  const val = event.target.value;
  this.digits[index] = val.slice(-1);

  if (val && index < 5) {
    // Không dùng this.inputs.toArray() nữa vì nó hay bị undefined ở bản TS mới
    // Chuyển sang dùng DOM selector trực tiếp trong component
    const allInputs = document.querySelectorAll('.code-field');
    const nextInput = allInputs[index + 1] as HTMLInputElement;
    if (nextInput) nextInput.focus();
  }
  
  if (this.digits.every(d => d !== '')) {
    this.submit();
  }
}

onKeyDown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
    // Tìm ô input phía trước
    const prevInput = (event.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
    if (prevInput) prevInput.focus();
  }
}

  submit() {
    const code = this.digits.join('');
    this.dialogRef.close(code);
  }
}