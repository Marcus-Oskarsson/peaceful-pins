// import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

import { LockedPost, UnlockedPost } from '../types';

import postService from '../api/axios';

type PostResponse = {
  success: boolean;
  posts: UnlockedPost[] | LockedPost[];
};

// Mina egna posts
async function getMyPosts(): Promise<PostResponse> {
  const response = await postService.get('/my-posts');
  return response.data;
}

// Alla mina upplåsta posts (ska visas på nån egen sida)
async function getMyUnlockedPosts(): Promise<PostResponse> {
  const response = await postService.get('/posts/unlocked-posts');
  return response.data;
}

// Mina vänners posts (både låsta och upplåsta - ska plottas på kartan)
async function getFriendsPosts(): Promise<PostResponse> {
  const response = await postService.get('/posts/friends');
  return response.data;
}

// Offentliga posts (både låsta och upplåsta - ska plottas på kartan)
async function getPublicPosts(): Promise<PostResponse> {
  const response = await postService.get('/posts/public');
  return response.data;
}

// Skapa en ny post
async function addPost(postData: FormData) {
  const response = await postService.post('/posts', postData, {
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });
  return response.data;
}

export function useGetMyPosts() {
  return useQuery({
    queryKey: ['my-posts'],
    queryFn: getMyPosts,
  });
}

export function useGetFriendsPosts() {
  return useQuery({
    queryKey: ['friends-posts'],
    queryFn: getFriendsPosts,
  });
}

export function useGetPublicPosts() {
  return useQuery({
    queryKey: ['public-posts'],
    queryFn: getPublicPosts,
  });
}

export function useAddPost() {
  return useMutation({
    mutationFn: addPost,
  });
}

export function useGetMyUnlockedPosts() {
  return useQuery({
    queryKey: ['my-unlocked-posts'],
    queryFn: getMyUnlockedPosts,
  });
}
