import { User } from '@types';
import noProfileImg from '@assets/no-profile-img.webp';

import './ProfileInfo.scss';

export function ProfileInfo({ user }: { user: User }) {
  return (
    <div className="user-card">
      <img
        className="user-img"
        src={user.profilepicture || noProfileImg}
        alt={user.fullname}
      />
      <h1 className="user-name">{user.fullname}</h1>
    </div>
  );
}
