// src/pages/Inventory.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LandRegistryABI from "../abis/LandRegistry.json";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CONTRACT_ADDRESS = "0x2Eb46f51954078b7937683E47EDe1Acb52465A99";
const W3W_API_KEY = "PRYVQ7PF";

function Inventory() {
  const [releaseW3W, setReleaseW3W] = useState("");
  const [myW3W, setMyW3W] = useState("");
  const [theirW3W, setTheirW3W] = useState("");
  const [theirAddress, setTheirAddress] = useState("");
  const [message, setMessage] = useState("");
  const [myLands, setMyLands] = useState([]);
  const [coordsList, setCoordsList] = useState([]);

  useEffect(() => {
    fetchMyLands();
  }, []);

  const fetchMyLands = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LandRegistryABI, signer);
      const lands = await contract.getUserLands();
      setMyLands(lands);
      convertToCoordinates(lands);
    } catch (err) {
      console.error("Error fetching lands:", err);
    }
  };

  const convertToCoordinates = async (lands) => {
    const results = await Promise.all(
      lands.map(async (word) => {
        try {
          const res = await fetch(
            `https://api.what3words.com/v3/convert-to-coordinates?words=${word}&key=${W3W_API_KEY}`
          );
          const data = await res.json();
          return { word, lat: data.coordinates.lat, lng: data.coordinates.lng };
        } catch (e) {
          console.error("Failed to convert:", word, e);
          return null;
        }
      })
    );
    setCoordsList(results.filter(Boolean));
  };

  const releaseLand = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LandRegistryABI, signer);
      const tx = await contract.releaseLand(releaseW3W, address);
      await tx.wait();
      setMessage(`Released land: ${releaseW3W}`);
      fetchMyLands();
    } catch (err) {
      console.error(err);
      setMessage("Failed to release land.");
    }
  };

  const swapLand = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LandRegistryABI, signer);
      const tx = await contract.swapLand(myW3W, theirAddress, theirW3W);
      await tx.wait();
      setMessage(`Swapped ${myW3W} with ${theirW3W}`);
      fetchMyLands();
    } catch (err) {
      console.error(err);
      setMessage("Failed to swap land.");
    }
  };

  const viewMyLands = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LandRegistryABI, signer);
      const address= await signer.getAddress();
      const tx = await contract.getUserLands(address);
      // console.log("My Lands:", tx);
      // await tx.wait();
      setMessage(`My Lands: ${tx}`);
      
      fetchMyLands();
    } catch (err) {
      console.error(err);
      setMessage("Failed to release land.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">My Lands</h1>
      <button onClick={viewMyLands} className="bg-red-600 text-white px-4 py-2 rounded">
        View My Lands
        </button>
        {message && <p className="mt-4 text-blue-600">{message}</p>}
      <div className="mb-4">
        <h2 className="text-xl">Release Land</h2>
        <input
          type="text"
          placeholder="Enter W3W address"
          value={releaseW3W}
          onChange={(e) => setReleaseW3W(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={releaseLand} className="bg-red-600 text-white px-4 py-2 rounded">
          Release
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl">Swap Land</h2>
        <input
          type="text"
          placeholder="Your W3W"
          value={myW3W}
          onChange={(e) => setMyW3W(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Their Address"
          value={theirAddress}
          onChange={(e) => setTheirAddress(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Their W3W"
          value={theirW3W}
          onChange={(e) => setTheirW3W(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={swapLand} className="bg-yellow-600 text-white px-4 py-2 rounded">
          Swap
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl mb-2">Map View</h2>
        <MapContainer center={[0, 0]} zoom={2} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coordsList.map(({ word, lat, lng }, idx) => (
            <Marker position={[lat, lng]} key={idx}>
              <Popup>{word}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
}

export default Inventory;
