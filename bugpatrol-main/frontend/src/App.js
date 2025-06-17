import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './pages/Home';
import Form from './pages/Form'
import Registration from './pages/Registration'
import Navbars from './components/Navbar';
import './App.css';
import { BookDashed, LogIn } from 'lucide-react';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/form" element={<> <Navbars/> <Form/>    </>} />
        
      </Routes>
    </Router>
  );
}

export default App;