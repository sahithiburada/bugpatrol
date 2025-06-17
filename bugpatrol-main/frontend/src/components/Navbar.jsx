import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Navbar.css';
import logo from './logo.png'
const Navbars = () => {
  return (
    <Navbar bg="white" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand href="#home">
          <div className="logo-container">
            <img src={logo} alt="BugPatrol Logo" className="logo-image" />
            <span className="logo-text">BugPatrol</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#community">Community</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
          </Nav>
          <div className="d-flex">
            <Nav.Link href="/login" className="me-3 login-link">Login</Nav.Link>
            <Button variant="/register" className="get-started-btn">
              Get started
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbars;