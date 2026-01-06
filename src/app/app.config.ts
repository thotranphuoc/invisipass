import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Firebase Imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// Material Imports (Cần thiết cho Dialog và các hiệu ứng Overlay)
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    // Tối ưu hóa việc phát hiện thay đổi
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Cấu hình Router và Animations
    provideRouter(routes),
    provideAnimationsAsync(),

    // Khởi tạo Firebase App với cấu hình từ environment
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    
    // Cung cấp dịch vụ Authentication (Google Login)
    provideAuth(() => getAuth()),
    
    // Cung cấp dịch vụ Firestore Database
    provideFirestore(() => getFirestore()),

    // Import các Provider từ Module (Dành cho MatDialog hoạt động ổn định)
    importProvidersFrom(MatDialogModule)
  ]
};