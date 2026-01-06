export interface PasswordAccount {
  id?: string;
  label: string;      // Tên gợi nhớ (ví dụ: Facebook, Gmail)
  appPath: string;    // URL hoặc tên ứng dụng (ví dụ: facebook.com)
  username: string;   // Đã mã hóa
  password: string;   // Đã mã hóa
  createdAt?: any;
}