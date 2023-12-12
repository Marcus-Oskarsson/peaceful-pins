export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  profilePicture: string;
  friends: User[];
  posts: Post[];
};

export type Post = {
  id: string;
  author: Partial<User>;
  text: string;
  createdAt: string;
  longitude: number;
  latitude: number;
  comments: Partial<Post>[];
};
