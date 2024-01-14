import { Navigate } from 'react-router-dom';

import { useUserContext } from '@hooks/useUserContext';

import { FriendList } from '@components/FriendList';
import { ProfileInfo } from '@components/ProfileInfo';
import './Profile.scss';

export function Profile() {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="profile">
      <ProfileInfo user={user} />
      <FriendList />
    </div>
  );
}
