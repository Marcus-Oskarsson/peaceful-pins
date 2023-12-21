import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

function MapTwo() {
  // TODO - Borde inte själv hämta posts utan borde hanteras i annan komponent och endast rendera kartan med posts som props

  const testMsg = [
    { id: 1, msg: "Ett hej. blabla.", lat: 57.67903137207031, lng: 12.003543998718262 },
    { id: 2, msg: "Igen. blabla.", lat: 57.67903137207031, lng: 12.00154399871262 },
  ]

  return (
    <MapContainer style={{ height: 736 }} center={[57.67993137207031, 12.001543998718262]} zoom={14} scrollWheelZoom={false} >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {testMsg.map((msg) => (
        <Marker key={msg.id} position={[msg.lat, msg.lng]} >
          <Popup>
            {msg.msg}
          </Popup>
        </Marker>
      ))}
      
    </MapContainer>
  )
}

export default MapTwo