import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/userDataContext'; // Import UserContext

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [organizationName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [tenantJoinCode, setJoinCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser(); // Access setUser from context
  const navigate = useNavigate(); // For navigation after signup
   
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !organizationName || !email || !password || !tenantJoinCode) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
        name,
        organizationName,
        email,
        tenantJoinCode,
        password,
      });

      if(response.status === 200) {
        const userData = {
            fullname: name,
            email: email,
            
          };
          setUser(userData); // Store user data in context
          alert('Signup successful!');
          navigate('/login'); 
    }
    else{
        throw new Error(response.data.message || 'Signup failed!');
    }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Error message:'+ error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-md bg-gray-50 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Organization"
              value={organizationName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-md bg-gray-50 outline-none"
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 outline-none"
            required
          />

          <input
            type="text"
            placeholder="Join Code"
            value={tenantJoinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 outline-none"
            required
          />

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 outline-none"
            required
          />

          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            Show Password
          </label>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;