// types/auth.ts

// Tipe untuk data formulir
export interface IFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Tipe untuk balasan error (validasi 422) dari Laravel
export interface IErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
  email_verified?: boolean;
}

// Tipe untuk data User
export interface IUser {
  id: number;
  name: string;
  email: string;
}

// Tipe untuk balasan sukses login
export interface ILoginResponse {
  message: string;
  token: string;
  user: IUser;
}

// Tipe untuk payload (data yang dikirim)
export interface ILoginPayload {
  email: string;
  password: string;
}
export interface IRegisterPayload extends ILoginPayload {
  name: string;
  password_confirmation: string;
}
