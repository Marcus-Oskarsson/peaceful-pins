// import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

import { newPost, Post } from '../types';

import postService from '../api/axios';


// const postService = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-type': 'application/json',
//   },
// });

// Mina egna posts
async function getMyPosts(): Promise<Post[]> {
  const response = await postService.get('/my-posts');
  return response.data;
}

// Mina vänners posts (som jag låst upp - ska visas på nån egen sida)
async function getFriendsUnlockedPosts(): Promise<Post[]> {
  const response = await postService.get('/unlocked-friends-posts');
  return response.data;
}

// Offentliga posts (som jag låst upp - ska visas på nån egen sida)
async function getPublicUnlockedPosts(): Promise<Post[]> {
  const response = await postService.get('/unlocked-public-posts');
  return response.data;
}

// Mina vänners posts (både låsta och upplåsta - ska plottas på kartan)
async function getFriendsPosts(): Promise<Post[]> {
  const response = await postService.get('/friends-posts');
  return response.data;
}

// Offentliga posts (både låsta och upplåsta - ska plottas på kartan)
async function getPublicPosts(): Promise<Post[]> {
  const response = await postService.get('/public-posts');
  return response.data;
}

// Skapa en ny post
async function addPost(postData) {
  const response = await postService.post('/posts', postData, {
    headers: {
      'Content-type': 'multipart/form-data',
    }
  });
  return response.data;
}

export function useGetMyPosts() {
  return useQuery({
    queryKey: ['my-posts'],
    queryFn: getMyPosts,
  });
}

export function useGetFriendsUnlockedPosts() {
  return useQuery({
    queryKey: ['unlocked-friends-posts'],
    queryFn: getFriendsUnlockedPosts,
  });
}

export function useGetPublicUnlockedPosts() {
  return useQuery({
    queryKey: ['unlocked-public-posts'],
    queryFn: getPublicUnlockedPosts,
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
