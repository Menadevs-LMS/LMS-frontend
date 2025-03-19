import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { setLoading } from '../../store/auth';
import axios from 'axios';

function Button({ value, onClick }) {
  return (
    <button
      onClick={onClick || (() => {})}
      className="mt-6 transition transition- all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg">
      {value}
    </button>
  )
}

function Input({ type, id, name, label, placeholder, autofocus, handleChange }) {
  return (
    <label className="text-gray-500 block mt-3">{label}
      <input
        autoFocus={autofocus}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100" />
    </label>
  )
}

function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    event?.preventDefault();
    setError("");
    
    try {
      const loginData = {
        userEmail,
        password
      };

      const response = await axios.post(`${backendUrl}/auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(response.data);
      
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
      <div className="border-t-8 rounded-sm border-indigo-600 bg-white p-12 shadow-2xl w-96">
        <h1 className="font-bold text-center block text-2xl">Log In</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleLogin}>
          <Input 
            type="email" 
            id="userEmail" 
            name="userEmail" 
            label="Email Address" 
            placeholder="me@example.com" 
            autofocus={true} 
            handleChange={setUserEmail} 
          />
          <Input 
            type="password" 
            id="password" 
            name="password" 
            label="Password" 
            placeholder="••••••••••" 
            handleChange={setPassword} 
          />
          <Button value="Login" onClick={handleLogin} />

          <p className='p-2'>
            Don't have an account?{" "}
            <a className="blue" href="/signup">
              Signup
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login