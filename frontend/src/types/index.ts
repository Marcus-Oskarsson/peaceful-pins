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
  id: number;
  author: string;
  authorid: number;
  title: string;
  createdat: string;
  location: { x: number; y: number };
  isunlocked: boolean;
};

export type LockedPost = Post & {
  isunlocked: false;
};

export type UnlockedPost = Post & {
  isunlocked: true;
  content: string;
  image: string;
  comments: Partial<Post>[];
};

export type newPost = {
  title: string;
  content: string;
  visibility: 'public' | 'friends';
  image: File | null;
};

export type Position = {
  location: { latitude: number; longitude: number };
  accuracy: number;
};
