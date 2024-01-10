import { useQuery } from '@tanstack/react-query';

import userService from '../api/axios';

import { User } from '@types';

type FriendResponse = {
  success: boolean;
  friends: Partial<User>[];
};

// Mina egna posts
async function getFriends(): Promise<FriendResponse> {
  const response = await userService.get('/friends');
  console.log('getFriends', response.data);
  return response.data;
}

export function useGetFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
  });
}
