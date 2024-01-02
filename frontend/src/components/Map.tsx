import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { usePosition } from '@hooks/usePosition';
import { Post } from '@types';

interface MapProps {
  posts: Post[];
}

export function Map({ posts }: MapProps) {
  console.log(posts[0].location.x, posts[0].location.y);
  // TODO change center to user location

  const { latitude, longitude } = usePosition();
  console.log(latitude, longitude);

  if (!latitude || !longitude) return null;

  return (
    <MapContainer
      style={{ height: 736 }}
      center={[latitude, longitude]}
      zoom={14}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
          {!msg.isUnlocked && (
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
