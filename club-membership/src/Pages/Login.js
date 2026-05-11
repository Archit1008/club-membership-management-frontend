import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8989/api/auth/login', formData);
      const token = res.data;
      localStorage.setItem('token', token);

      // Decode token to get role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role =payload.roles?.[0];
      console.log(role);

      // Navigate based on role
      if (role === 'ADMIN') {
        navigate('/events'); // Admin sees EventForm, UpdateEventForm, EventList
      } else if (role === 'MEMBER') {
        navigate('/eventsList'); // Member sees EventList with RSVP
      }
      else if(role === 'OWNER'){
        navigate('/events');
      } else {
        alert('Unknown role');
      }
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;