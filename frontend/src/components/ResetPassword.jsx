import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiLock, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = import.meta.env.VITE_API_URL;
      await axios.post(`${baseURL}/api/users/reset-password/${token}`, { password });
      
      alert("Password has been reset successfully! Please log in.");
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid or expired link.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative px-4 overflow-hidden font-sans">
      
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e50a_1px,transparent_1px),linear-gradient(to_bottom,#4f46e50a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10">
        
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/20 mb-4">
              <FiCheckCircle className="text-green-400 text-xl" />
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Set New Password</h2>
           <p className="text-gray-400">Secure your account with a new password.</p>
        </div>
        
        {error && <p className="text-red-400 text-sm text-center mb-6 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <FiLock className="absolute top-3.5 left-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required placeholder="New Password"
              className="w-full pl-12 pr-4 py-3 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors">
            <FiArrowLeft className="mr-2" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;