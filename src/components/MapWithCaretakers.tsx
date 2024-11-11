import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CaretakerBasics } from "../models/Caretaker";
import { useEffect, useState } from "react";

interface MapWithCaretakersProps {
  caretakers: CaretakerBasics[];
}

type Location = {
  id: string;
  name: string;
  surname: string;
  photoUrl: string | null;
  street: string;
  city: string;
  lat: number;
  lon: number;
};


const MapWithCaretakers: React.FC<MapWithCaretakersProps> = ({ caretakers }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  const customIcon = (photoUrl: string | null) => {
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
    const fetchCoordinates = async () => {
      const results = await Promise.all(
        caretakers.map(async (caretaker: CaretakerBasics) => {
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
              photoUrl: caretaker.accountData.profilePicture?.url || null,
              street: caretaker.address.street,
              city: caretaker.address.city,
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
            };
          }
          return null;
        })
      );
      setLocations(results.filter((loc) => loc !== null));
    };

    fetchCoordinates();
  }, [caretakers]);

  return (
    <MapContainer center={[52.2297, 21.0122]} zoom={6} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lon]} icon={customIcon(loc.photoUrl)}>
          <Popup>
            <div>
              <h3>{loc.name} {loc.surname}</h3>
              <p>Address: {loc.street}, {loc.city}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithCaretakers;
