import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ setCoords }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCoords(e.latlng);
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={markerIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition(latlng);
          setCoords(latlng);
        },
      }}
    />
  ) : null;
}

export default function MapPicker() {
  const [coords, setCoords] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 🔍 Fetch search suggestions (Nominatim)
  useEffect(() => {
    if (query.length < 3) return;
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => res.json())
      .then((data) => setSuggestions(data));
  }, [query]);

  // 🗺️ Center map on chosen suggestion
  const handleSelect = (place) => {
    setCoords({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setSuggestions([]);
    setQuery(place.display_name);
  };

  return (
    <div
      style={{ width: "100%", height: "100%", maxWidth: 600, margin: "auto" }}
    >
      <div style={{ position: "relative", marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Search for a place..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "white",
              listStyle: "none",
              padding: 0,
              margin: 0,
              border: "1px solid #ddd",
              maxHeight: 150,
              overflowY: "auto",
              zIndex: 1000,
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                onClick={() => handleSelect(s)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <MapContainer
        center={coords ? [coords.lat, coords.lng] : [20.5937, 78.9629]}
        zoom={coords ? 14 : 5}
        style={{ height: "400px", width: "100%", borderRadius: "10px" }}
        key={coords ? `${coords.lat}-${coords.lng}` : "map"}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker setCoords={setCoords} />
      </MapContainer>

      {coords && (
        <p style={{ marginTop: 10 }}>
          📍 <b>Latitude:</b> {coords.lat.toFixed(6)}, <b>Longitude:</b>{" "}
          {coords.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
