// src/pages/ClaimLand.js
import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import LandRegistryABI from "../abis/LandRegistry.json";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CONTRACT_ADDRESS = "0x2Eb46f51954078b7937683E47EDe1Acb52465A99";
const W3W_API_KEY = "PRYVQ7PF";

// Fix leaflet's broken marker icon URLs in Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const GoToMyLocation = ({ onLocate }) => {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 16);
        onLocate(latitude, longitude);
      },
      () => {
        alert("Failed to retrieve location.");
      }
    );
  };

  return (
    <button
      onClick={handleLocate}
      className="absolute top-4 right-4 z-[1000] bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
    >
      Go to My Location
    </button>
  );
};

function ClaimLand() {
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const convertToW3W = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat},${lng}&key=${W3W_API_KEY}`
      );
      const data = await res.json();
      // if (data.words) {
        setLocation("filled.count.soap"); //toddler.geologist.animated //filled.count.soap
        setMessage(`📍 W3W address: ${data.words}`);
      // } else {
      //   setMessage("❌ Failed to convert to W3W.");
      // }
    } catch (err) {
      setMessage("❌ Error calling What3Words API.");
    }
  };

  const handleLocate = (lat, lng) => {
    setCoords([lat, lng]);
    convertToW3W(lat, lng);
  };

  const claimLand = async () => {
    console.log("location", location);
    if (!location) {
      setMessage("Please locate and convert to W3W before claiming.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LandRegistryABI, signer);
      const tx = await contract.claimLand(location); //toddler.geologist.animated //filled.count.soap
      await tx.wait();
      setMessage(`✅ Successfully claimed: ${location}`);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Failed to claim land: ${err.reason || err.message}`);
    }
  };

  return (
    <div className="relative space-y-6">
      <h1 className="text-2xl font-bold">Claim Land</h1>

      <div className="relative h-[70vh] rounded shadow overflow-hidden">
        <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coords && <Marker position={coords} />}
          <GoToMyLocation onLocate={handleLocate} />
        </MapContainer>
      </div>

      {location && (
        <div className="text-lg">
          🌐 Claimed W3W location: <span className="font-mono">{location}</span>
        </div>
      )}

      <button
        onClick={claimLand}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Claim Land
      </button>

      {message && <p className="text-blue-600">{message}</p>}
    </div>
  );
}

export default ClaimLand;
