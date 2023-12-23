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

export type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Post = {
  id: string;
  author: Partial<User>;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  location: [number, number];
  comments: Partial<Post>[];
};

export type newPost = {
  title: string;
  content: string;
  visibility: 'public' | 'friends';
  image: File | null;
};
