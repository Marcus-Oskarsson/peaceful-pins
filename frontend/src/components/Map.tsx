import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useWindowSize } from 'usehooks-ts';

import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { usePositionContext } from '@contexts/PositionContext';

import { Post } from '@types';

interface MapProps {
  posts: Post[];
}

export function Map({ posts }: MapProps) {
  const positionContext = usePositionContext();
  const size = useWindowSize();

  const PersonIcon = new Icon({
    iconUrl: 'https://news.ycombinator.com/y18.svg',
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
        <Marker
          key={msg.id}
          position={[msg.location.x, msg.location.y]}
          eventHandlers={{
            click: (e) => {
              console.log(e);
            },
          }}
        >
          {!msg.isunlocked && (
            <Circle
              center={[msg.location.x, msg.location.y]}
              radius={200}
              eventHandlers={{
                click: (e) => {
                  console.log(e);
                },
              }}
            />
          )}
          <Popup>{msg.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
