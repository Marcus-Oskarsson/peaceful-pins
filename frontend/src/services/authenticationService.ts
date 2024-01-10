import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

import { LoginCredentials, NewUser, User } from '@types';

import authService from '../api/axios';

interface userResponse {
  data: {
    user: User;
  };
}

async function login(userData: LoginCredentials) {
  const response = await authService.post<userResponse>('/login', {
    user: userData,
  });
  return response.data;
}

async function register(userData: NewUser) {
  const response = await authService.post<AxiosResponse<userResponse>>(
    '/register',
    {
      user: userData,
    },
  );
  return response.data;
}

async function authCheck(): Promise<{ success: boolean }> {
  const response = await authService.get('/auth_check');
  return response.data;
}

async function logout() {
  await authService.delete('/logout');
}

async function getUser() {
  const response = await authService.get<AxiosResponse<userResponse>>('/user');
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

export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
