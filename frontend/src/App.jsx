import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; 
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import LandingPage from "./components/LandingPage";
import SplashScreen from "./components/SplashScreen";
import Dashboard from "./components/Dashboard";
import PublicProfile from './components/PublicProfile';
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        // Simulated delay for splash screen effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [API_URL]);

  if (loading) return <SplashScreen />;

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
        {user && <Navbar user={user} setUser={setUser} />}
        
        <Routes>
          {/* Public Routes */}
          <Route path="/welcome" element={!user ? <LandingPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
          <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
          <Route path="/u/:username" element={<PublicProfile />} />

          {/* Protected Dashboard Route - Handles sub-routes internally */}
          {user ? (
            <Route path="/*" element={<Dashboard />} />
          ) : (
            <Route path="/*" element={<Navigate to="/welcome" />} />
          )}
          
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;