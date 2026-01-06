import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { PasswordService } from '../../services/password.service';
import { EncryptionService } from '../../services/encryption.service';
import { PasswordAccount } from '../../models/password-account.interface';
import { PasscodeDialogComponent } from '../passcode-dialog/passcode-dialog.component';

@Component({
  selector: 'app-password-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasscodeDialogComponent],
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.scss']
})
export class PasswordListComponent implements OnInit {
  private passwordService = inject(PasswordService);
  public encryptionService = inject(EncryptionService);
  private clipboard = inject(Clipboard);
  private fb = inject(FormBuilder);

  allAccounts = signal<PasswordAccount[]>([]);
  searchTerm = signal('');
  searchControl = new FormControl('');
  
  expandedId = signal<string | null>(null);
  editingId = signal<string | null>(null);
  showPasscodeModal = false;
  editForm: FormGroup;

  isLocked = computed(() => !this.encryptionService.getIsUnlocked());
  accounts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allAccounts().filter(acc => 
      acc.label.toLowerCase().includes(term) || acc.appPath.toLowerCase().includes(term)
    );
  });

  constructor() {
    this.editForm = this.fb.group({
      label: ['', Validators.required],
      appPath: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.passwordService.getPasswords().subscribe(data => this.allAccounts.set(data));
    this.searchControl.valueChanges.subscribe(val => this.searchTerm.set(val || ''));
  }

  toggleCard(id: string) {
    if (this.editingId()) return;

    if (this.isLocked()) {
      this.showPasscodeModal = true; // Auto-trigger passcode modal
      return;
    }
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  decrypt(val: string) { return this.encryptionService.decrypt(val); }

  copy(event: Event, text: string) {
    event.stopPropagation();
    this.clipboard.copy(text);
  }

  startEdit(event: Event, acc: PasswordAccount) {
    event.stopPropagation();
    this.editingId.set(acc.id!);
    this.editForm.patchValue({
      label: acc.label,
      appPath: acc.appPath,
      username: this.decrypt(acc.username),
      password: this.decrypt(acc.password)
    });
  }

  cancelEdit(event: Event) {
    event.stopPropagation();
    this.editingId.set(null);
  }

  async saveUpdate(event: Event, id: string) {
    event.stopPropagation();
    if (this.editForm.invalid) return;
    const val = this.editForm.value;
    const updatedData = {
      label: val.label,
      appPath: val.appPath,
      username: this.encryptionService.encrypt(val.username),
      password: this.encryptionService.encrypt(val.password)
    };
    await this.passwordService.updateAccount(id, updatedData);
    this.editingId.set(null);
  }

  async deleteAccount(event: Event, id: string | undefined) {
    event.stopPropagation();
    if (id && confirm('Are you sure you want to delete this record?')) {
      await this.passwordService.deleteAccount(id);
    }
  }
}