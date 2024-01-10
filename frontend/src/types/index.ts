export type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
  username: string;
  profilepicture: string;
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
  location: { x: number; y: number };
  comments: Partial<Post>[];
  isunlocked: boolean;
};

export type LockedPost = Post & {
  isunlocked: false;
};

export type UnlockedPost = Post & {
  isunlocked: true;
};

export type newPost = {
  title: string;
  content: string;
  visibility: 'public' | 'friends';
  image: File | null;
};
