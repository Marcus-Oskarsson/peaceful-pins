import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

type PostData = {
  userId: string;
};

type Post = {
  id: string;
  userId: string;
  title: string;
  // TODO add more fields
};

async function addPost(postData: PostData) {
  const response = await axios.post<Response>('/login', postData); // TODO update endpoint
  return response.data;
}

async function getPosts({ queryKey }: { queryKey: string[] }): Promise<Post[]> {
  const userId = queryKey[1];
  const response = await axios.get('/posts', { params: { userId } });
  return response.data;
}

export function useAddPost() {
  return useMutation({
    mutationFn: addPost,
  });
}

export function useGetPosts(userId: string) {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: getPosts,
  });
}
