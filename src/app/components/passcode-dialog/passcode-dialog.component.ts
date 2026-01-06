import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-passcode-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content glass" (click)="$event.stopPropagation()">
        <h2 class="title">Security Check</h2>
        <p class="subtitle">Enter your 6-digit PIN to access vault</p>
        
        <div class="code-inputs" (paste)="onPaste($event)">
          <input *ngFor="let digit of [0,1,2,3,4,5]; let i = index"
            type="password"
            maxlength="1"
            class="code-field"
            [(ngModel)]="codes[i]"
            (input)="onInput($event, i)"
            (keydown.backspace)="onBackspace($event, i)"
            inputmode="numeric" />
        </div>

        <div class="actions">
          <button class="btn-secondary" (click)="onCancel()">Cancel</button>
          <button class="btn-primary" [disabled]="!isComplete()" (click)="onUnlock()">
            Unlock Now
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./passcode-dialog.component.scss']
})
export class PasscodeDialogComponent {
  @Output() close = new EventEmitter<void>(); // Event để đóng modal
  
  private encryptionService = inject(EncryptionService);
  codes: string[] = ['', '', '', '', '', ''];

  isComplete() { return this.codes.every(c => c !== ''); }

  onInput(event: any, index: number) {
    if (event.target.value && index < 5) {
      const inputs = document.querySelectorAll('.code-field');
      (inputs[index + 1] as HTMLInputElement).focus();
    }
  }

  onBackspace(event: any, index: number) {
    if (!this.codes[index] && index > 0) {
      const inputs = document.querySelectorAll('.code-field');
      (inputs[index - 1] as HTMLInputElement).focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    const data = event.clipboardData?.getData('text').slice(0, 6).split('');
    if (data) {
      data.forEach((char, i) => this.codes[i] = char);
    }
  }

  onUnlock() {
    if (this.isComplete()) {
      this.encryptionService.setPasscode(this.codes.join(''));
      this.close.emit(); // Đóng modal sau khi unlock thành công
    }
  }

  onCancel() {
    this.close.emit();
  }
}