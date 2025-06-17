// LoginPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Determine endpoint based on role
      const endpoint = role === 'citizen' 
        ? 'http://localhost:5000/api/auth/login/user' 
        : 'http://localhost:5000/api/auth/login/authority';
          console.log(formData);
      const response = await axios.post(endpoint, formData,{ withCredentials: true });
        
      // Store token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
  
       console.log(response.data.user);
      // Redirect based on role
      const redirectPath = role === 'citizen' ? '/form' : '/dashboard';
      navigate(redirectPath);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="w-100" style={{ maxWidth: '700px' }}>
        <div className="bg-white rounded p-4 p-sm-5 shadow">
          <h1 className="text-center">Spot. Report. Improve.</h1>
          <p className="text-center text-muted mb-4">Login to BugPatrol</p>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <div className="d-flex justify-content-center gap-5 mb-4">
            <Form.Check
              type="radio"
              label="Citizen"
              name="role"
              value="citizen"
              id="citizen-role"
              checked={role === 'citizen'}
              onChange={handleRoleChange}
            />
            <Form.Check
              type="radio"
              label="Authority"
              name="role"
              value="authority"
              id="authority-role"
              checked={role === 'authority'}
              onChange={handleRoleChange}
            />
          </div>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="youremail@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Logging in...' : 'Login →'}
              </Button>
            </div>
          </Form>
          
          <div className="text-center mt-4">
            <p className="mb-0">
              Don't have an account? <a href="/register">Create Account</a>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;