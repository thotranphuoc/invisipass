import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Mặc định là 'dark' (true = dark, false = light)
  isDarkMode = signal<boolean>(true);

  constructor() {
    // Tự động cập nhật class vào body khi signal thay đổi
    effect(() => {
      if (this.isDarkMode()) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }
}