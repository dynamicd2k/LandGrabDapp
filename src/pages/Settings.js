// src/pages/Settings.js
import React, { useState } from "react";
import { ethers } from "ethers";
import UserRegistryABI from "../abis/UserRegistry.json";

const CONTRACT_ADDRESS = "0xdb07aE2D1f8B66c2f2ccB1F1C7FFAbDFb31eD43c";

function Settings() {
  const [message, setMessage] = useState("");

  const deleteAccount = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, UserRegistryABI, signer);
      const address = await signer.getAddress();
      console.log("Deleting account for address:", address);
      const tx = await contract.deleteUser(address);
      await tx.wait();
      setMessage("Account successfully deleted. All lands have been released.");
    } catch (err) {
      setMessage(`Failed to delete account: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Settings</h1>

      <button onClick={deleteAccount} className="bg-red-600 text-white px-4 py-2 rounded">
        Delete Account
      </button>

      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
}

export default Settings;
