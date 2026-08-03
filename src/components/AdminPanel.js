import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Row, Col, Form, Alert, Nav } from 'react-bootstrap';
import { FaLock, FaSignOutAlt, FaShieldAlt, FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedNews, setApprovedNews] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('adminAuth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const loadData = () => {
    const pending = JSON.parse(localStorage.getItem('userSubmittedNews') || '[]');
    const approved = JSON.parse(localStorage.getItem('approvedNews') || '[]');
    setPendingRequests(pending);
    setApprovedNews(approved);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
    window.addEventListener('userNewsChanged', loadData);
    window.addEventListener('approvedNewsChanged', loadData);
    return () => {
      window.removeEventListener('userNewsChanged', loadData);
      window.removeEventListener('approvedNewsChanged', loadData);
    };
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('❌ Incorrect Admin Password! Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  const handleApprove = (item) => {
    const pending = JSON.parse(localStorage.getItem('userSubmittedNews') || '[]');
    const updatedPending = pending.filter(p => p.id !== item.id);
    localStorage.setItem('userSubmittedNews', JSON.stringify(updatedPending));

    const approved = JSON.parse(localStorage.getItem('approvedNews') || '[]');
    const updatedApproved = [item, ...approved];
    localStorage.setItem('approvedNews', JSON.stringify(updatedApproved));

    setPendingRequests(updatedPending);
    setApprovedNews(updatedApproved);

    window.dispatchEvent(new Event('userNewsChanged'));
    window.dispatchEvent(new Event('approvedNewsChanged'));
  };

  const handleReject = (id) => {
    const pending = JSON.parse(localStorage.getItem('userSubmittedNews') || '[]');
    const updatedPending = pending.filter(p => p.id !== id);
    localStorage.setItem('userSubmittedNews', JSON.stringify(updatedPending));
    setPendingRequests(updatedPending);
    window.dispatchEvent(new Event('userNewsChanged'));
  };

  const handleDeleteApproved = (id) => {
    const approved = JSON.parse(localStorage.getItem('approvedNews') || '[]');
    const updatedApproved = approved.filter(item => item.id !== id);
    localStorage.setItem('approvedNews', JSON.stringify(updatedApproved));
    setApprovedNews(updatedApproved);

    window.dispatchEvent(new Event('approvedNewsChanged'));
  };

  if (!isAuthenticated) {
    return (
      <div className="container my-5" style={{ maxWidth: '450px' }}>
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden text-center">
          <Card.Header className="bg-dark text-white py-4">
            <div className="mb-2">
              <FaShieldAlt size={40} className="text-warning" />
            </div>
            <h4 className="fw-bold mb-0">Admin Authentication</h4>
            <small className="text-secondary">Protected Access Only</small>
          </Card.Header>

          <Card.Body className="p-4">
            {loginError && (
              <Alert variant="danger" className="rounded-3 shadow-sm py-2 fs-7">
                {loginError}
              </Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-4 text-start">
                <Form.Label className="fw-bold d-flex align-items-center gap-2">
                  <FaLock className="text-primary" /> Admin Password
                </Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter admin password (admin123)..." 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  autoFocus
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 fw-bold py-2 rounded-pill shadow">
                🔓 Unlock Admin Panel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold border-start border-4 border-danger ps-3 mb-0">
          🛡️ Admin News Control Panel
        </h3>
        <Button variant="outline-danger" size="sm" className="fw-bold rounded-pill px-3" onClick={handleLogout}>
          <FaSignOutAlt className="me-1" /> Logout Admin
        </Button>
      </div>

      <Nav variant="pills" className="mb-4 gap-2 border-bottom pb-3">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'pending'} 
            onClick={() => setActiveTab('pending')}
            className="fw-bold d-flex align-items-center gap-2 rounded-pill px-4"
          >
            <FaClock /> Pending Review Requests 
            <Badge bg="danger" pill>{pendingRequests.length}</Badge>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'approved'} 
            onClick={() => setActiveTab('approved')}
            className="fw-bold d-flex align-items-center gap-2 rounded-pill px-4"
          >
            <FaCheckCircle /> Published Live News 
            <Badge bg="success" pill>{approvedNews.length}</Badge>
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === 'pending' && (
        <>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-5 card border-0 shadow-sm p-5 text-muted">
              <h5>🎉 No pending news submission requests at the moment.</h5>
            </div>
          ) : (
            <Row className="g-4">
              {pendingRequests.map((item) => (
                <Col md={6} key={item.id}>
                  <Card className="shadow-sm border-0 h-100 rounded-3 overflow-hidden">
                    {item.image && (
                      <Card.Img 
                        variant="top" 
                        src={item.image} 
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between mb-2">
                        <Badge bg="primary" className="uppercase">{item.category}</Badge>
                        <small className="text-muted">By: {item.author || 'Anonymous'}</small>
                      </div>
                      <Card.Title className="fs-6 fw-bold">{item.title}</Card.Title>
                      <Card.Text className="text-secondary small flex-grow-1">
                        {item.description}
                      </Card.Text>
                      
                      <div className="d-flex gap-2 pt-3 border-top mt-2">
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="w-50 fw-bold"
                          onClick={() => handleApprove(item)}
                        >
                          ✔ Approve & Publish to Main Page
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="w-50 fw-bold"
                          onClick={() => handleReject(item.id)}
                        >
                          ✖ Reject
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {activeTab === 'approved' && (
        <>
          {approvedNews.length === 0 ? (
            <div className="text-center py-5 card border-0 shadow-sm p-5 text-muted">
              <h5>📰 No approved user news currently live on the site.</h5>
            </div>
          ) : (
            <Row className="g-4">
              {approvedNews.map((item) => (
                <Col md={6} key={item.id}>
                  <Card className="shadow-sm border-0 h-100 rounded-3 overflow-hidden border-start border-4 border-success">
                    {item.image && (
                      <Card.Img 
                        variant="top" 
                        src={item.image} 
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between mb-2">
                        <Badge bg="success" className="uppercase">LIVE ON HOME FEED</Badge>
                        <small className="text-muted">Author: {item.author || 'Admin'}</small>
                      </div>
                      <Card.Title className="fs-6 fw-bold">{item.title}</Card.Title>
                      <Card.Text className="text-secondary small flex-grow-1">
                        {item.description}
                      </Card.Text>
                      
                      <div className="pt-3 border-top mt-2 text-end">
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="fw-bold d-inline-flex align-items-center gap-1 rounded-pill px-3"
                          onClick={() => handleDeleteApproved(item.id)}
                        >
                          <FaTrash /> Remove / Delete from Main Page
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPanel;