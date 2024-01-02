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
  authorId: number;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  location: { x: number; y: number };
  comments: Partial<Post>[];
  isUnlocked: 't' | 'f';
};

export type newPost = {
  title: string;
  content: string;
  visibility: 'public' | 'friends';
  image: File | null;
};
