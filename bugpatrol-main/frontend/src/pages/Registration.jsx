import React, { useState, useEffect } from 'react';
import './Registration.css';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Authority');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    department: '',
    governmentId: '',
    position: '',
    occupation: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [pageTitle, setPageTitle] = useState('Stay Informed. Stay Responsive.');
  const [errors, setErrors] = useState({});
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  // Update page title when role changes
  useEffect(() => {
    if (role === 'Citizen') {
      setPageTitle('Spot. Report. Improve.');
    } else {
      setPageTitle('Stay Informed. Stay Responsive.');
    }
  }, [role]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Role-specific validations
    if (role === 'Authority') {
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.governmentId.trim()) newErrors.governmentId = "Government ID is required";
      if (!formData.position.trim()) newErrors.position = "Position is required";
    } else {
      if (!formData.occupation.trim()) newErrors.occupation = "Occupation is required";
    }
    
    return newErrors;
  };

  const requestOTP = async () => {
    if (!formData.email) {
      setErrors({ ...errors, email: "Email is required for OTP verification" });
      return;
    }
    
    try {
      // API call to send OTP
      const response = await fetch('http://localhost:5000/api/otp/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setOtpRequested(true);
        setOtpMessage('OTP sent successfully. Please check your email.');
      } else {
        const errorData = await response.json();
        setOtpMessage(errorData.message || 'Failed to send OTP');
      }
    } catch (error) {
      setOtpMessage('Failed to send OTP. Please try again.');
    }
  };

  const verifyOTP = async () => {
    if (!formData.otp) {
      setErrors({ ...errors, otp: "Please enter OTP" });
      return;
    }

    try {
      // API call to verify OTP
      const response = await fetch('http://localhost:5000/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email,
          otp: formData.otp 
        }),
      });

      if (response.ok) {
        setOtpVerified(true);
        setOtpMessage('OTP verified successfully.');
        setIsSubmitEnabled(true);
      } else {
        const errorData = await response.json();
        setOtpMessage(errorData.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setOtpMessage('Failed to verify OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0 || !otpVerified) {
      if (!otpVerified) {
        setOtpMessage('Please verify OTP before submitting');
      }
      setErrors(formErrors);
      return;
    }
  
    // Format data based on role
    const formattedData =
      role === 'Authority'
        ? {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            department: formData.department,
            governmentId: formData.governmentId,
            position: formData.position,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            occupation: formData.occupation,
            password: formData.password,
          };
  
    try {
      const endpoint =
        role === 'Authority'
          ? 'http://localhost:5000/api/auth/authority/register'
          : 'http://localhost:5000/api/auth/user/register';
          
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (response.ok) {
        navigate('/login', { state: { message: 'Registration successful' } });
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({
        general: 'Registration failed. Please try again later.',
      });
    }
  };
  

  return (
    <div className="page-container">
      <div className="card-container">
       
        
        <div className="form-section">
          <div className="form-header">
            <h1>{pageTitle}</h1>
            <p>Choose Your Role to Join BugPatrol</p>
          </div>
          
          <div className="role-selection">
            <div 
              className={`role-option ${role === 'Citizen' ? 'selected' : ''}`}
              onClick={() => handleRoleChange('Citizen')}
            >
              <input 
                type="radio" 
                name="role" 
                checked={role === 'Citizen'} 
                onChange={() => {}}
              />
              <label>Citizen</label>
            </div>
            
            <div 
              className={`role-option ${role === 'Authority' ? 'selected' : ''}`}
              onClick={() => handleRoleChange('Authority')}
            >
              <input 
                type="radio" 
                name="role" 
                checked={role === 'Authority'} 
                onChange={() => {}}
              />
              <label>Authority</label>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jhon Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="jhondoe@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10 digit number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
              
              {role === 'Authority' ? (
                <div className="form-group">
                  <label>Date Of Birth</label>
                  <div className="date-input">
                    <input
                      type="date"
                      name="dateOfBirth"
                      placeholder="DD-MM-YYYY"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                    <span className="calendar-icon"></span>
                  </div>
                  {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
                </div>
              ) : (
                <div className="form-group">
                  <label>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    placeholder="e.g. Journalist"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                  {errors.occupation && <span className="error">{errors.occupation}</span>}
                </div>
              )}
            </div>
            
            {role === 'Authority' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <div className="select-wrapper">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      <option value="Health">Health</option>
                      <option value="Education">Ministry of Education</option>
                      <option value="Security">Security</option>
                      <option value="Environment">Environment</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </select>
                  </div>
                  {errors.department && <span className="error">{errors.department}</span>}
                </div>
                
                <div className="form-group">
                  <label>Government ID</label>
                  <input
                    type="text"
                    name="governmentId"
                    placeholder="12349523"
                    value={formData.governmentId}
                    onChange={handleChange}
                  />
                  {errors.governmentId && <span className="error">{errors.governmentId}</span>}
                </div>
              </div>
            )}
            
            {role === 'Authority' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    placeholder="e.g. Technical engineer"
                    value={formData.position}
                    onChange={handleChange}
                  />
                  {errors.position && <span className="error">{errors.position}</span>}
                </div>
                
                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span className="eye-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: 'pointer' }}></span>
                  </div>
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>
              </div>
            )}
             {role === 'Citizen' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Date Of Birth</label>
                  <div className="date-input">
                    <input
                      type="text"
                      name="dateOfBirth"
                      placeholder="DD-MM-YYY"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                    <span className="calendar-icon"></span>
                  </div>
                  {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
                </div>
                
                <div className="form-group">
                  <label>OTP Verification</label>
                  <div className="otp-input">
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      disabled={!otpRequested}
                    />
                    {otpVerified ? (
                      <span className="verify-btn success">✓</span>
                    ) : (
                      <button 
                        type="button" 
                        className="verify-btn"
                        onClick={otpRequested ? verifyOTP : requestOTP}
                      >
                        {otpRequested ? 'Verify OTP' : 'Send OTP'}
                      </button>
                    )}
                  </div>
                  {otpMessage && <span className={otpVerified ? "success-message" : "info-message"}>{otpMessage}</span>}
                  {errors.otp && <span className="error">{errors.otp}</span>}
                </div>
              </div>
            )}
            {role === 'Citizen' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}></span>
                  </div>
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>
                
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="12345&Aaw"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <span className="eye-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: 'pointer' }}></span>
                  </div>
                  {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
              </div>
            )}
            
            {role === 'Authority' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="12345&Aaw"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <span className="eye-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: 'pointer' }}
                    ></span>
                  </div>
                  {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
                
                <div className="form-group">
                  <label>OTP Verification</label>
                  <div className="otp-input">
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      disabled={!otpRequested}
                    />
                    {otpVerified ? (
                      <span className="verify-btn success">✓</span>
                    ) : (
                      <button 
                        type="button" 
                        className="verify-btn"
                        onClick={otpRequested ? verifyOTP : requestOTP}
                      >
                        {otpRequested ? 'Verify OTP' : 'Send OTP'}
                      </button>
                    )}
                  </div>
                  {otpMessage && <span className={otpVerified ? "success-message" : "info-message"}>{otpMessage}</span>}
                  {errors.otp && <span className="error">{errors.otp}</span>}
                </div>
              </div>
            )}
            
            {errors.general && <div className="general-error">{errors.general}</div>}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className={`register-btn ${!otpVerified ? 'disabled' : ''}`}
                disabled={!otpVerified}
              >
                Register As {role}
              </button>
              <p className="login-link">
    Already have an account? <a href="/login">Login</a>
  </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;