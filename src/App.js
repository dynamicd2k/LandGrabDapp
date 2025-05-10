// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Inventory from "./pages/Inventory";
import ClaimLand from "./pages/ClaimLand";
import Settings from "./pages/Settings";
import RegisterUser from "./pages/RegisterUser";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto">
            <Link to="/" className="text-lg font-semibold text-blue-600">
              LandGrab dApp
            </Link>
            <div className="float-center">
              <Link to="/registerUser" className="text-blue-600 mx-4">Register User</Link>
            </div>
            <div className="float-right">
              <Link to="/claim" className="text-blue-600 mx-4">Claim Land</Link>
              <Link to="/settings" className="text-blue-600">Settings</Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/claim" element={<ClaimLand />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/registerUser" element={<RegisterUser />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
