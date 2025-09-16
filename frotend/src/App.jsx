import React from 'react';


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Login from './components/Login';
import Register from './components/register';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        {/* FIX: Changed the path for Home to "/" to make it the landing page */}
        <Route path="/home" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      
    </BrowserRouter> 
  );
}

export default App;