import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Briefcase, Building, Shield, Edit2, Check, X, Eye, EyeOff } from 'lucide-react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const { userInfo, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ reportsCount: 0, resolvedCount: 0 });
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, message: "Reported a bug in transport department portal", time: "20mins ago", type: "report" },
    { id: 2, message: "Your report #B-123 has been resolved", time: "50mins ago", type: "resolved" },
    { id: 3, message: "Your report #B-14564 has been resolved", time: "1hour ago", type: "resolved" }
  ]);

  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, [userInfo]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${userInfo.email}`, {
        params: { role: userInfo.role },
      });
      setUserData(response.data.user);
      setEditValues(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/stats/${userInfo.email}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEdit = (field) => setEditingField(field);
  
  const handleSave = async (field) => {
    try {
      
      const updateData = { [field]: editValues[field], role: userInfo.role };
      console.log(updateData)
      const response = await axios.put(`http://localhost:5000/api/profile/${userInfo.email}`, updateData);

      if (response.status === 200) {
        setUserData(prev => ({ ...prev, [field]: editValues[field] }));
        setEditingField(null);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = (field) => {
    setEditValues(prev => ({ ...prev, [field]: userData[field] }));
    setEditingField(null);
  };

  const handleInputChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const renderEditableField = (field, label, value, type='text', icon) => {
    const isEditing = editingField === field;
    return (
      <Form.Group className="mb-4">
        <Form.Label className="d-flex align-items-center gap-2 fw-medium text-secondary">
          {icon}{label}
        </Form.Label>
        {isEditing ? (
          <div className="d-flex align-items-center gap-2">
            {field === 'password' ? (
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={editValues[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </InputGroup>
            ) : (
              <Form.Control
                type={type}
                value={editValues[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                style={{ flex: 1 }}
              />
            )}
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handleSave(field)}
              className="px-3"
            >
              <Check size={18} />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleCancel(field)}
              className="px-3"
            >
              <X size={18} />
            </Button>
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-between border rounded p-3 bg-light">
            <div className="flex-grow-1">
              {field === 'password' ? '••••••••' : (value || 'Not set')}
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => handleEdit(field)}
              className="text-primary p-1"
            >
              <Edit2 size={18} />
            </Button>
          </div>
        )}
      </Form.Group>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container fluid className="px-4">
        <Row className="g-4">
          {/* Left Sidebar */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 rounded-4">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div 
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-primary"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <User size={40} className="text-white" />
                  </div>
                  <h3 className="fw-bold mb-2">{userData?.name || 'User'}</h3>
                  <p className="text-muted fs-5">
                    {userInfo.role === 'citizen' ? userData?.occupation : 'Government Official'}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="text-muted fw-medium">Reports Filed</span>
                    <span className="fw-bold fs-4">{stats.reportsCount}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="text-muted fw-medium">Resolved Issues</span>
                    <span className="fw-bold fs-4">{stats.resolvedCount}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="text-muted fw-medium">Member since</span>
                    <span className="fw-bold">Jan 2024</span>
                  </div>
                </div>

                <ListGroup variant="flush" className="mb-4">
                  <ListGroup.Item className="bg-primary bg-opacity-10 text-primary fw-medium rounded-3 mb-2 border-0">
                    <User size={20} className="me-2" /> Profile Settings
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0 rounded-3 mb-2" style={{ cursor: 'pointer' }}>
                    <Shield size={20} className="me-2" /> My Reports
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0 rounded-3" style={{ cursor: 'pointer' }}>
                    <Building size={20} className="me-2" /> Community Posts
                  </ListGroup.Item>
                </ListGroup>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 rounded-3 fw-semibold"
                  onClick={() => {
      logout();
      navigate('/login');
    }}
                >
                  Sign Out
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={8}>
            <div className="d-flex flex-column gap-4">
              {/* Profile Information */}
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="p-4">
                  <h4 className="fw-semibold mb-4">Profile Information</h4>
                  <Row>
                    <Col md={6}>
                      {renderEditableField('name', 'Full Name', userData?.name, 'text', <User size={18} className="text-muted" />)}
                      {renderEditableField('phone', 'Phone Number', userData?.phone, 'tel', <Phone size={18} className="text-muted" />)}
                      {userInfo.role === 'citizen' ? 
                        renderEditableField('occupation', 'Occupation', userData?.occupation, 'text', <Briefcase size={18} className="text-muted" />) :
                        renderEditableField('department', 'Department', userData?.department, 'text', <Building size={18} className="text-muted" />)
                      }
                    </Col>
                    <Col md={6}>
                      {renderEditableField('email', 'Email', userData?.email, 'email', <Mail size={18} className="text-muted" />)}
                      {renderEditableField('dateOfBirth', 'Date Of Birth', userData?.dateOfBirth, 'date', <Calendar size={18} className="text-muted" />)}
                      {renderEditableField('password', 'Password', '', 'password', <Shield size={18} className="text-muted" />)}
                    </Col>
                    {userInfo.role === 'authority' && (
                      <Col xs={12}>
                        {renderEditableField('governmentId', 'Government ID', userData?.governmentId, 'text', <Shield size={18} className="text-muted" />)}
                        {renderEditableField('position', 'Position', userData?.position, 'text', <Briefcase size={18} className="text-muted" />)}
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              {/* Notifications */}
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="p-4">
                  <h4 className="fw-semibold mb-4">Notifications</h4>
                  <div className="d-flex flex-column gap-3">
                    {notifications.map((notification) => (
                      <Alert 
                        key={notification.id}
                        variant={notification.type === 'resolved' ? 'success' : 'primary'}
                        className="d-flex align-items-start gap-3 mb-0 border-0 rounded-3"
                      >
                        <div 
                          className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                            notification.type === 'resolved' ? 'bg-success bg-opacity-25' : 'bg-primary bg-opacity-25'
                          }`}
                          style={{ width: '40px', height: '40px' }}
                        >
                          {notification.type === 'resolved' ? (
                            <Check size={20} className="text-success" />
                          ) : (
                            <Shield size={20} className="text-primary" />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-medium">{notification.message}</p>
                          <small className="text-muted">{notification.time}</small>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;