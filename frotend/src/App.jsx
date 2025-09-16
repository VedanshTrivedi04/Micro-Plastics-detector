import React from 'react';


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        {/* Make Home the landing page */}
        <Route path="/home" element={<Home />} />

        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      
    </BrowserRouter> 
  );
}

export default App;