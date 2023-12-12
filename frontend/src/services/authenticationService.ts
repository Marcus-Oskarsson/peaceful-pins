import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { User } from '@types';

const authService = axios.create({
  baseURL: '/api',
  headers: {
    'Content-type': 'application/json',
  },
});

async function login(userData: { email: string; password: string }) {
  const response = await authService.post<Response>('/login', userData);
  return response.data;
}

async function register(userData: User) {
  const response = await authService.post<Response>('/register', userData);
  return response.data;
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}
