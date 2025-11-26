import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import {
  IFormData,
  IErrorResponse,
  ILoginResponse,
  ILoginPayload,
  IRegisterPayload,
} from '@/types/auth';

export default function useAuthForm(initialModeIsRegistering: boolean) {
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(initialModeIsRegistering);

  const [formData, setFormData] = useState<IFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const endpoint = isRegistering ? '/register' : '/login';

    const loginBody: ILoginPayload = {
      email: formData.email,
      password: formData.password,
    };

    const bodyToSend: ILoginPayload | IRegisterPayload = isRegistering
      ? {
          ...loginBody,
          name: formData.name,
          password_confirmation: formData.password_confirmation,
        }
      : loginBody;

    try {
      const response = await apiClient.post(endpoint, bodyToSend);
      const data = response.data;

      if (isRegistering) {
        setSuccess('Registrasi berhasil! Silakan login.');
        setIsRegistering(false);
        setFormData((prev) => ({
          ...prev,
          name: '',
          password: '',
          password_confirmation: '',
        }));
      } else {
        const loginData = data as ILoginResponse;
        setSuccess('Login berhasil!');

        localStorage.setItem('authToken', loginData.token);

        router.push('/admin/dashboard');
      }
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data as IErrorResponse;
        let errorMessage = errorData.message || 'Terjadi kesalahan.';

        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).flat().join('\n');
        }
        setError(errorMessage);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan tidak dikenal');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setError(null);
    setSuccess(null);
    setFormData((prev) => ({
      ...prev,
      password: '',
      password_confirmation: '',
    }));
  };

  return {
    isRegistering,
    formData,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    success,
    toggleMode,
  };
}
