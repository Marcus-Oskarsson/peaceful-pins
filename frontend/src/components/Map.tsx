import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useWindowSize } from 'usehooks-ts';

import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { usePositionContext } from '@hooks/usePositionContext';
import { useIndistance } from '@hooks/useIndistance';

import { LockedPost, UnlockedPost } from '@types';
import { useUnlockPost } from '@services/messageService';

interface MapProps {
  posts: (UnlockedPost | LockedPost)[];
}

function CustomMarker({ msg }: { msg: UnlockedPost | LockedPost }) {
  const positionContext = usePositionContext();
  const { inDistance, accuracy } = useIndistance({
    latitude: msg.location.x,
    longitude: msg.location.y,
  });
  const unlockMutation = useUnlockPost();

  function unlock() {
    if (
      !inDistance ||
      !positionContext?.latitude ||
      !positionContext?.longitude
    )
      return;
    unlockMutation.mutate({
      postId: `${msg.id}`,
      position: {
        location: {
          latitude: positionContext.latitude,
          longitude: positionContext.longitude,
        },
        accuracy,
      },
    });
  }

  return (
    <Marker key={msg.id} position={[msg.location.x, msg.location.y]}>
      {!msg.isunlocked && (
        <Circle
          center={[msg.location.x, msg.location.y]}
          radius={200 + accuracy}
        />
      )}
      <Popup>
        <div>
          <p>{msg.author}</p>
          <p>{msg.title}</p>
          {msg.isunlocked ? (
            <p>{msg.content}</p>
          ) : (
            <svg
              onClick={!msg.isunlocked && unlock}
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M10 1.75a4.25 4.25 0 0 0-4.104 5.354L1.75 11.25v3h3v-1.5h1.5v-1.5h1.5L8.9 10.1c.359.098.728.148 1.1.15a4.25 4.25 0 0 0 0-8.5"></path>
                <circle
                  cx="10.75"
                  cy="5.25"
                  r=".5"
                  fill="currentColor"
                ></circle>
              </g>
            </svg>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export function Map({ posts }: MapProps) {
  const positionContext = usePositionContext();
  const size = useWindowSize();

  const PersonIcon = new Icon({
    iconUrl: 'https://api.iconify.design/ph:person-simple-walk-bold.svg',
    iconSize: [24, 24],
  });

  if (!positionContext?.latitude || !positionContext?.longitude) return null;
  return (
    <MapContainer
      style={{ height: size.height - 64, zIndex: 1 }}
      center={[positionContext.latitude, positionContext.longitude]}
      zoom={12}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[positionContext.latitude, positionContext.longitude]}
        icon={PersonIcon}
      >
        <Popup>You are here</Popup>
      </Marker>

      {posts.map((msg) => (
        <CustomMarker msg={msg} />
      ))}
    </MapContainer>
  );
}
