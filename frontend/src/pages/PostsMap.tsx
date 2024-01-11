import { useState } from 'react';

import { Map } from '@components/Map';
import {
  useGetFriendsPosts,
  useGetPublicPosts,
} from '@services/messageService';
import { AxiosError } from 'axios';
import { Navigate } from 'react-router-dom';

type ListType = 'friends' | 'public';

export function PostsMap() {
  const [listType, setListType] = useState<ListType>('friends');
  const friendsPosts = useGetFriendsPosts();
  const publicPosts = useGetPublicPosts();

  const postsToRender = listType === 'friends' ? friendsPosts : publicPosts;

  function toggleList() {
    setListType((prev) => (prev === 'friends' ? 'public' : 'friends'));
  }

  if (postsToRender.error as AxiosError & { response: { status: number } })
    return <Navigate to="/login" />;

  return (
    <div>
      <button type="button" onClick={toggleList}>
        Toggle
      </button>
      {postsToRender.isError ? (
        <div>Something went wrong ...</div>
      ) : postsToRender.isLoading ? (
        <div>Loading ...</div>
      ) : !postsToRender?.data || postsToRender.data.posts.length === 0 ? (
        <div>No posts to show</div>
      ) : (
        <Map posts={postsToRender.data.posts} />
      )}
    </div>
  );
}
