import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

import { LoginCredentials, NewUser, User } from '@types';

import authService from '../api/axios';

// const authService = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-type': 'application/json',
//   },
// });

async function login(userData: LoginCredentials) {
  const response = await authService.post<User>('/login', {
    user: userData,
  });
  return response.data;
}

async function register(userData: NewUser) {
  const response = await authService.post<AxiosResponse<User>>('/register', {
    user: userData,
  });
  return response.data;
}

async function authCheck(): Promise<User> {
  const response = await authService.get('/auth_check');
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

export function useAuthCheck() {
  return useQuery({
    queryKey: ['authCheck'],
    queryFn: authCheck,
  });
}

// export function useLogout() {
//   return useMutation({
//     mutationFn: () => authService.delete('/logout'),
//   });
// }
