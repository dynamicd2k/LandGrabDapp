// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Inventory from "./pages/Inventory";
import ClaimLand from "./pages/ClaimLand";
import Settings from "./pages/Settings";
import RegisterUser from "./pages/RegisterUser";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <NavLink to="/" className="text-2xl font-bold text-blue-600">
              LandGrab dApp
            </NavLink>

            <div className="flex space-x-6 items-center">
              <NavLink
                to="/registerUser"
                className={({ isActive }) =>
                  `text-md font-medium ${
                    isActive ? "text-blue-700" : "text-blue-600 hover:text-blue-800"
                  }`
                }
              >
                Register User
              </NavLink>
              <NavLink
                to="/claim"
                className={({ isActive }) =>
                  `text-md font-medium ${
                    isActive ? "text-blue-700" : "text-blue-600 hover:text-blue-800"
                  }`
                }
              >
                Claim Land
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `text-md font-medium ${
                    isActive ? "text-blue-700" : "text-blue-600 hover:text-blue-800"
                  }`
                }
              >
                Settings
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6">
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
