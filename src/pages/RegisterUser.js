import React, { useState } from 'react';
import { ethers } from 'ethers';
import UserContractABI from '../abis/UserRegistry.json';

const USER_CONTRACT_ADDRESS = '0xdb07aE2D1f8B66c2f2ccB1F1C7FFAbDFb31eD43c';

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setStatus(`✅ Wallet connected: ${address}`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ Wallet connection failed: ${err.message}`);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setStatus('Wallet disconnected.');
  };

  const register = async () => {
    if (!walletAddress) {
      setStatus("Please connect your wallet first.");
      return;
    }

    try {
      setStatus("Preparing contract...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(USER_CONTRACT_ADDRESS, UserContractABI, signer);

      setStatus("Sending transaction...");
      const tx = await contract.registerUser(); // add username param if needed
      await tx.wait();

      setStatus("✅ User registered successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + (err.reason || err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Register User</h2>

      {!walletAddress ? (
        <button
          onClick={connectWallet}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-gray-700">
            Connected: <span className="font-mono">{walletAddress}</span>
          </div>
          <button
            onClick={disconnectWallet}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Disconnect Wallet
          </button>
        </div>
      )}

      <button
        onClick={register}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Register
      </button>

      <p className="text-sm text-gray-700">{status}</p>
    </div>
  );
};

export default RegisterUser;
