import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components from react-router-dom
import Login from './Pages/Login/Login'; // Example component for Login page
import Homepage from './Pages/Homepage/Homepage'; // Import your homepage component

const App = () => {
  return (
    <Router> {/* Wrapping the routes inside Router */}
      <Routes>
        {/* Define the routes for your app */}
        <Route path="/" element={<Login />} /> {/* Home page route */}
        <Route path="/homepage" element={<Homepage />} /> {/* User's homepage route */}
      </Routes>
    </Router>
  );
};

export default App;
