import { usePositionContext } from '@contexts/PositionContext';
import {
  LockedPost as LockedPostType,
  UnlockedPost as UnlockedPostType,
} from '../types';

import './PostList.scss';

type PostListProps = {
  posts: LockedPostType[] | UnlockedPostType[];
};

function UnlockedPost({ post }: { post: UnlockedPostType }) {
  const postDate = new Date(post.createdat).toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="post-title">{post.title}</div>
        <div className="post-info">
          {post.author}, {postDate}
        </div>
      </div>
      <div className="post-body">
        <img className="post-img" src={post.image} alt="" />
        <p className="post-content">
          {post.content} Här ger jag bara ett exempel på en längre text. Lorem
          ipsum dolor sit amet consectetur, adipisicing elit. Aperiam sunt iure
          officiis amet placeat, facilis sapiente recusandae animi voluptate
          voluptas rerum? Repudiandae minima unde adipisci delectus inventore
          quas temporibus officiis!
        </p>
      </div>
    </div>
  );
}

function LockedPost({ post }: { post: LockedPostType }) {
  const positionContext = usePositionContext();

  // TODO Bryt ut findDistance till en egen funktion (och testa den!)
  // TODO Bestäm radie för att låsa upp meddelanden
  // TODO Måste spara användarens position i context och välja uppdateringsfrekvens därifrån, också enklare att styra om anänvdaren inte accepterar att dela sin position (eller om den inte finns)
  function toRad(val: number) {
    return (val * Math.PI) / 180;
  }

  function calculateDistance(lat1: number, lon1: number) {
    const latitude = positionContext?.latitude;
    const longitude = positionContext?.longitude;
    if (!latitude || !longitude) return null;

    const R = 6371000; // km
    const dLat = toRad(latitude - lat1);
    const dLon = toRad(longitude - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((R * c) / 100) * 100;
  }

  return (
    <div className="post-container locked">
      <div className="post-header">
        <div className="post-title">{post.title}</div>
        <div className="post-author">{post.author}</div>
      </div>
      <div className="post-body">
        <img src="" alt="låst" />
        {positionContext?.latitude && positionContext?.longitude && (
          <p>
            Distance: {calculateDistance(post.location.x, post.location.y)}m
          </p>
        )}
      </div>
    </div>
  );
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul className="post-list">
      {posts.map((post) => {
        if (post.isunlocked) {
          return <UnlockedPost post={post} />;
        } else {
          return <LockedPost post={post} />;
        }
      })}
    </ul>
  );
}
