import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CaretakerBasics } from "../models/Caretaker";
import { useEffect, useState } from "react";
import UserInfoPill from "./UserInfoPill";
import { Photo } from "../types";

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

const MapWithCaretakers: React.FC<MapWithCaretakersProps> = ({ 
  caretakers, 
  center=[51.1, 17.0]
}) => {
  const [locations, setLocations] = useState<Location[]>([]);

  const customIcon = (photoUrl: string | undefined) => {
    return L.divIcon({
      html: `<div 
        class="custom-leaflet-avatar"
        style="background-image: url('${photoUrl || "/default-avatar.png"}')"
      />`,
      iconSize: [40, 40],
      className: "",
    });
  };

  useEffect(() => {
    const fetchCaretakerCoordinates = async () => {
      const results = await Promise.all(
        caretakers.filter(caretaker => caretaker.accountData.profilePicture).map(async (caretaker: CaretakerBasics) => {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              `${caretaker.address.street}, ${caretaker.address.city}, ${caretaker.address.voivodeship}`
            )}`
          );
          const data = await response.json();
          if (data.length > 0) {
            return {
              id: caretaker.accountData.email,
              name: caretaker.accountData.name,
              surname: caretaker.accountData.surname,
              photo: caretaker.accountData.profilePicture,
              street: caretaker.address.street,
              city: caretaker.address.city,
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
            };
          }
          return null;
        })
      );
      console.log(results);
      setLocations(results.filter((loc) => loc !== null));
    };

    fetchCaretakerCoordinates();
  }, [caretakers]);

  return (
    <MapContainer 
      center={center}
      zoom={12} 
      style={{ height: "500px", width: "100%" 
    }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lon]} icon={customIcon(loc.photo?.url)}>
          <Popup>
            <UserInfoPill 
              user={{ name: loc.name, surname: loc.surname, email: loc.id, profilePicture: loc.photo }}
              isLink={true}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithCaretakers;
