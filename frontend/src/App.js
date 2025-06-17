import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './pages/Home';
import Form from './pages/Form';
import Registration from './pages/Registration';
import Navbars from './components/Navbar';
import './App.css';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext'; // ⬅️ you’ll create this
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Show Navbar on all routes except /login and /register */}
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <>
                <Navbars />
                <Home />
              </>
            }
          />
          <Route
            path="/form"
            element={
              <>
                <Navbars />
                <Form />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Navbars />
                <Dashboard />
              </>
            }
          />
          <Route path="/profile" element={
              <>
                <Navbars />
                <Profile />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
