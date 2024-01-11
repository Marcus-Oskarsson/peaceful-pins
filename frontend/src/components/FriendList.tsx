import { v4 as uuidv4 } from 'uuid';

import { useGetFriends } from '@services/userService';
import { User } from '@types';

import './FriendList.scss';

export function FriendList() {
  const { data, isError, isSuccess } = useGetFriends();

  console.log('friend list', data);

  if (isError) {
    return <div>error</div>;
  }

  if (!isSuccess) {
    return <div>loading</div>;
  }

  return (
    <div className="friend-list">
      <h2 className="friend-title">Friends</h2>
      <div className="friends-container">
        {data &&
          data.friends.map((friend: Partial<User>) => {
            return (
              <div className="friend" key={uuidv4()}>
                <h3 className="friend-name">{friend.fullname}</h3>
                <img
                  className="friend-img rounded"
                  src={friend.profilepicture}
                  alt=""
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
