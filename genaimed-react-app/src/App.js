import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Loginform from './components/Loginforms/Loginform';
import Registration from './components/Loginforms/Registration';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Loginform />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Loginform />} /> {}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
