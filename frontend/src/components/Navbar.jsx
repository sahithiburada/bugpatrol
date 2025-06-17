import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from './logo.png';
import ava from './user.png'; // Default avatar image
import './Navbar.css';

const Navbars = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar bg="white" expand="lg" className="py-3 shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand href="/">
          <div className="d-flex align-items-center">
            <img src={logo} alt="BugPatrol Logo" className="logo-image" />
            <span className="logo-text ms-2 fw-bold text-primary">BugPatrol</span>
          </div>
        </Navbar.Brand>

        {/* Collapsible nav */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between w-100">
  {!userInfo ? (
    <>
      {/* Centered Nav Links */}
      <Nav className="mx-auto text-center gap-4">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#community">Community</Nav.Link>
        <Nav.Link href="#about">About</Nav.Link>
        <Nav.Link href="#features">Features</Nav.Link>
      </Nav>

      {/* Right Side Buttons */}
      <div className="d-flex align-items-center gap-3">
        <Button variant="outline-dark" className="border" onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button variant="primary" onClick={() => navigate('/register')}>
          Get started
        </Button>
      </div>
    </>
  ) : (
   <div className="d-flex align-items-center justify-content-center gap-4 ms-auto">

  {/* Report Query in center */}
  {userInfo.role === 'citizen' && (
    <Button variant="primary" className='align-left' onClick={() => navigate('/form')}>
      Report Query <i className="bi bi-plus-lg ms-1"></i>
    </Button>
  )}

  {/* Icons */}
  <i className="bi bi-bell fs-5"></i>
  <i className="bi bi-moon fs-5"></i>

  {/* Avatar + Name horizontally */}
  <div className="d-flex align-items-center gap-2">
    <img
      src={userInfo.profilePic || ava}
      alt="Profile"
      className="rounded-circle"
      onClick={() => {
      navigate('/profile');
    }}
      width={32}
      height={32}
    />
    <span className="fw-semibold">{userInfo.name}</span>
  </div>

  {/* Logout */}
  <Button
    variant="outline-secondary"
    size="sm"
    onClick={() => {
      logout();
      navigate('/login');
    }}
  >
    Logout
  </Button>
</div>


  )}
</Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default Navbars;
