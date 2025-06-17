import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Navbars from '../components/Navbar';
import './Home.css';
import grp from './grp.png'

const Home = () => {
  return (
    <div className="home-page">
      <Navbars />
      
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12} className="hero-content">
              <h1 className="hero-title">Report & Resolve Government Website Issues Together</h1>
              <p className="hero-description">
                Join our community platform where citizens and authorities collaborate to improve digital government services.
              </p>
              <div className="hero-buttons">
                <Button variant="light" className="report-issue-btn">Report Issue</Button>
                <Button variant="outline-light" className="join-community-btn">Join Community</Button>
              </div>
            </Col>
            <Col lg={6} md={12} className="d-flex justify-content-center">
              <img src={grp} alt="Government Digital Services" className="hero-image" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title text-center">Platform Features</h2>
          <Row className="mt-5">
            <Col lg={4} md={4} sm={12}>
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <i className="bi bi-bug"></i>
                  </div>
                  <Card.Title className="feature-title">Bug Reporting</Card.Title>
                  <Card.Text className="feature-description">
                    Easy-to-use interface for reporting technical issues on government websites
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={4} sm={12}>
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <i className="bi bi-chat-dots"></i>
                  </div>
                  <Card.Title className="feature-title">Community Support</Card.Title>
                  <Card.Text className="feature-description">
                    Connect with others facing similar issues and share solutions.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={4} sm={12}>
              <Card className="feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <Card.Title className="feature-title">Official Response</Card.Title>
                  <Card.Text className="feature-description">
                    Direct issue resolvance by government authorities.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <Container>
          <h2 className="section-title text-center">How This Works ?</h2>
          <Row className="mt-5">
            <Col lg={3} md={6} sm={12} className="mb-4">
              <div className="step-container text-center">
                <div className="step-number">1</div>
                <h3 className="step-title">Report Issue</h3>
                <p className="step-description">Submit details about the bug you encounter</p>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12} className="mb-4">
              <div className="step-container text-center">
                <div className="step-number">2</div>
                <h3 className="step-title">Community Review</h3>
                <p className="step-description">Other users validate and discuss the issue</p>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12} className="mb-4">
              <div className="step-container text-center">
                <div className="step-number">3</div>
                <h3 className="step-title">Authority Notice</h3>
                <p className="step-description">Relevant department gets notified</p>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12} className="mb-4">
              <div className="step-container text-center">
                <div className="step-number">4</div>
                <h3 className="step-title">Resolution</h3>
                <p className="step-description">Issue gets fixed and verified</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Join Community Section */}
      <section className="join-community-section">
        <Container>
          <h2 className="section-title text-center mb-5"  >Join Our Growing Community</h2>
          <Row style={{marginLeft:'16%'}}>
            <Col lg={6} md={6} sm={12}>
              <div className="user-type-card">
                <h3 className="user-type-title">For Citizens</h3>
                <ul className="benefit-list">
                  <li>Report issues on any government website</li>
                  <li>Get community support and solutions</li>
                  <li>Track issue resolution progress</li>
                </ul>
                <Button variant="primary" className="user-type-btn">Join as Citizen</Button>
              </div>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <div className="user-type-card">
                <h3 className="user-type-title">For Authorities</h3>
                <ul className="benefit-list">
                  <li>Manage reported issues efficiently</li>
                  <li>Direct communication with citizens</li>
                  <li>Track department performance</li>
                </ul>
                <Button variant="primary" className="user-type-btn">Register as Authority</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <Row>
            <Col lg={3} md={6} sm={12} className="mb-4">
              <h4 className="footer-title">BugPatrol</h4>
              <p className="footer-description">Making government digital services better, together.</p>
            </Col>
            <Col lg={3} md={6} sm={12} className="mb-4">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#community">Community</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </Col>
            <Col lg={3} md={6} sm={12} className="mb-4">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li><a href="#help">Help Center</a></li>
                <li><a href="#terms">Terms Of Service</a></li>
                <li><a href="#privacy">Privacy & Security</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </Col>
            <Col lg={3} md={6} sm={12} className="mb-4">
              <h4 className="footer-title">Contact Us</h4>
              <p className="contact-info">
                <i className="bi bi-envelope"></i> support@bugpatrol.com
              </p>
              <p className="contact-info">
                <i className="bi bi-telephone"></i> +91 64283749872
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;