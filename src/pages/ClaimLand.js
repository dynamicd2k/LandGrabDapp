// src/pages/ClaimLand.js
import React, { useState } from "react";
import { ethers } from "ethers";
import LandRegistryABI from "../abis/LandRegistry.json";

const CONTRACT_ADDRESS = "0x2Eb46f51954078b7937683E47EDe1Acb52465A99";
const W3W_API_KEY = "PRYVQ7PF";

function ClaimLand() {
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      setMessage("Geolocation is not supported by this browser.");
    }
  };

  const onSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setMessage(`Geolocation retrieved successfully.${latitude}, ${longitude}`);
    convertToW3W(latitude, longitude);
  };

  const onError = (error) => {
    setMessage("Error retrieving geolocation.");
  };

  const convertToW3W = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat},${lng}&key=${W3W_API_KEY}`
      );
      const data = await res.json();
      console.log(data);
      setLocation(data.words);
      setMessage(`Coordinates converted to W3W: ${data.words}`);
    } catch (err) {
      setMessage("Error converting coordinates to W3W.");
    }
  };

  const claimLand = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LandRegistryABI, signer);
      const tx = await contract.claimLand("toddler.geologist.animated"); //toddler.geologist.animated //filled.count.soap
      await tx.wait();
      setMessage(`Successfully claimed: ${location}`);
    } catch (err) {
      setMessage(`Failed to claim land: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Claim Land</h1>

      <button onClick={getGeolocation} className="bg-green-600 text-white px-4 py-2 rounded">
        Claim Land by Location
      </button>

      {location && <p className="mt-4">Claimed land: {location}</p>}

      <button onClick={claimLand} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
        Claim Land
      </button>

      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
}

export default ClaimLand;
