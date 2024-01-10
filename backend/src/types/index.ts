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
  author: string;
  authorid: number;
  title: string;
  content: string;
  image: string;
  createdat: string;
  location: [number, number];
  comments: Partial<Post>[];
  isunlocked: boolean;
};

export type newPost = {
  title: string;
  content: string;
  visibility: 'public' | 'friends';
  image: File | null;
};
