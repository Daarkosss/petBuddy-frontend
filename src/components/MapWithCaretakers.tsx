import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import ReactDOMServer from "react-dom/server";
import { CaretakerBasics } from "../models/Caretaker";
import UserInfoPill from "./UserInfoPill";
import { Photo } from "../types";
import { useEffect } from "react";

interface MapWithCaretakersProps {
  caretakers: CaretakerBasics[];
  center?: [number, number];
}

type Location = {
  id: string;
  name: string;
  surname: string;
  photo: Photo | null;
  street: string;
  city: string;
  lat: number;
  lon: number;
};

const MapCenterUpdater = ({ center }: { center: [number, number] | undefined }) => {
  const map = useMap();

  useEffect(() => {
    if (!center) {
      return;
    }
    const [latitude, longitude] = center;
    if (latitude === 52.0 && longitude === 20.0) { 
      map.flyTo(center, 6) // If it is the country center, decrase the zoom
    } else {
      map.flyTo(center, 10);
    }
  }, [center, map]);

  return null;
};

const MapWithCaretakers: React.FC<MapWithCaretakersProps> = ({
  caretakers,
  center,
}) => {
  const locations: Location[] = caretakers.map((caretaker) => ({
    id: caretaker.accountData.email,
    name: caretaker.accountData.name,
    surname: caretaker.accountData.surname,
    photo: caretaker.accountData.profilePicture,
    street: caretaker.address.street,
    city: caretaker.address.city,
    lat: caretaker.address.latitude,
    lon: caretaker.address.longitude,
  }));

  const customIcon = (photoUrl?: string) =>
    L.divIcon({
      html: ReactDOMServer.renderToString(
        <img
          src={photoUrl || "/images/default-avatar.png"}
        />
      ),
      iconSize: [40, 40],
      className: "leaflet-avatar-icon",
    });
  
  return (
    <MapContainer center={center} zoom={6} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapCenterUpdater center={center} />
      <MarkerClusterGroup>
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lon]}
            icon={customIcon(loc.photo?.url)}
          >
            <Popup>
              <UserInfoPill
                user={{
                  name: loc.name,
                  surname: loc.surname,
                  email: loc.id,
                  profilePicture: loc.photo,
                }}
                isLink={true}
              />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapWithCaretakers;
