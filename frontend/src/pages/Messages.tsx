import { useGetMyUnlockedPosts } from '@services/messageService';

import { PostList } from '@components/PostList';

export function Messages() {
  const { data, error, isLoading } = useGetMyUnlockedPosts();
  console.log(data?.posts, error, isLoading);
  if (error || data === undefined) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>Meddelanden</h1>
          <div>
            <p>Här visas alla dina upplåsta meddelanden.</p>
            <p>Skriv ett eget meddelande</p>
          </div>
          <div>
            <h2>filter och sortering</h2>
          </div>
          <div className="post-wrapper">
            <PostList posts={data.posts} />
          </div>
        </>
      )}
    </>
  );
}
