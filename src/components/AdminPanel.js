import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Container, Card, Button, Badge, Row, Col, Alert, Tabs, Tab, Form, InputGroup } from 'react-bootstrap';
import { FaCheck, FaTimes, FaTrashAlt, FaLock, FaUserShield } from 'react-icons/fa';
=======
import { Card, Button, Badge, Row, Col, Form, Alert, Nav } from 'react-bootstrap';
import { FaLock, FaSignOutAlt, FaShieldAlt, FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';
>>>>>>> 3cc854b (Initial clean release)

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
<<<<<<< HEAD

  const [pendingList, setPendingList] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
  const [msg, setMsg] = useState('');

  // Default Admin Password
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      fetchData();
=======
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
>>>>>>> 3cc854b (Initial clean release)
    } else {
      setLoginError('❌ Incorrect Admin Password! Access Denied.');
    }
  };

<<<<<<< HEAD
  const fetchData = async () => {
    try {
      const resPending = await fetch('http://localhost:5000/api/pending-news');
      const dataPending = await resPending.json();
      setPendingList(dataPending);

      const resApproved = await fetch('http://localhost:5000/api/user-news');
      const dataApproved = await resApproved.json();
      setApprovedList(dataApproved);
    } catch (e) {
      console.error("Express server error", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/approve-news/${id}`, { method: 'POST' });
      if (res.ok) {
        setMsg("News Approved & Published Live!");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reject-news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg("Pending request rejected.");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLive = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/delete-news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg("Approved news permanently deleted!");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 🔒 Render Admin Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <Container className="my-5 d-flex justify-content-center">
        <Card className="shadow-lg border-0 p-4 rounded-4" style={{ maxWidth: '420px', width: '100%' }}>
          <div className="text-center mb-3">
            <FaUserShield size={50} className="text-primary mb-2" />
            <h3 className="fw-bold">Admin Portal</h3>
            <p className="text-muted small">Enter administrator key to access control panel.</p>
          </div>

          {loginError && <Alert variant="danger" className="py-2 fs-6">{loginError}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Admin Password</Form.Label>
              <InputGroup>
                <InputGroup.Text><FaLock /></InputGroup.Text>
                <Form.Control 
                  type="password" 
                  placeholder="Enter password" 
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
              Unlock Dashboard
            </Button>
          </Form>
        </Card>
      </Container>
    );
  }

  // 🛡️ Render Dashboard when authenticated
  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🛡️ Admin Control Panel</h2>
        <Button variant="outline-secondary" size="sm" onClick={() => setIsAuthenticated(false)}>
          🔒 Lock Dashboard
        </Button>
      </div>

      {msg && <Alert variant="info" onClose={() => setMsg('')} dismissible>{msg}</Alert>}

      <Tabs defaultActiveKey="pending" className="mb-4">
        <Tab eventKey="pending" title={`Pending Requests (${pendingList.length})`}>
          {pendingList.length === 0 ? (
            <Card className="text-center p-5 border-0 shadow-sm">
              <h5>🎉 No pending news requests!</h5>
            </Card>
          ) : (
            <Row className="g-4">
              {pendingList.map((item) => (
                <Col md={6} key={item.id}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Img variant="top" src={item.image} style={{ height: '180px', objectFit: 'cover' }} />
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <Badge bg="primary">{item.category?.toUpperCase()}</Badge>
                        <small className="text-muted">By: {item.author}</small>
                      </div>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text className="text-secondary">{item.description}</Card.Text>
                      
                      <div className="d-flex gap-2 mt-3 pt-2 border-top">
                        <Button variant="success" className="w-50" onClick={() => handleApprove(item.id)}>
                          <FaCheck className="me-1" /> Approve
                        </Button>
                        <Button variant="danger" className="w-50" onClick={() => handleReject(item.id)}>
                          <FaTimes className="me-1" /> Reject
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        <Tab eventKey="approved" title={`Live Published News (${approvedList.length})`}>
          {approvedList.length === 0 ? (
            <Card className="text-center p-5 border-0 shadow-sm">
              <h5>No user-submitted news currently live.</h5>
            </Card>
          ) : (
            <Row className="g-4">
              {approvedList.map((item) => (
                <Col md={6} key={item.id}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="success">LIVE</Badge>
                        <small className="text-muted">By: {item.author}</small>
                      </div>
                      <Card.Title className="fs-6 fw-bold">{item.title}</Card.Title>
                      
                      <div className="d-flex justify-content-end mt-3 pt-2 border-top">
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLive(item.id)}>
                          <FaTrashAlt className="me-1" /> Delete Live News
=======
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  // ✔ Approve News (Move to Live Main Page)
  const handleApprove = (item) => {
    // 1. Remove from Pending
    const pending = JSON.parse(localStorage.getItem('userSubmittedNews') || '[]');
    const updatedPending = pending.filter(p => p.id !== item.id);
    localStorage.setItem('userSubmittedNews', JSON.stringify(updatedPending));

    // 2. Add to Approved News
    const approved = JSON.parse(localStorage.getItem('approvedNews') || '[]');
    const updatedApproved = [item, ...approved];
    localStorage.setItem('approvedNews', JSON.stringify(updatedApproved));

    setPendingRequests(updatedPending);
    setApprovedNews(updatedApproved);

    // Notify App
    window.dispatchEvent(new Event('userNewsChanged'));
    window.dispatchEvent(new Event('approvedNewsChanged'));
  };

  // ✖ Reject Pending News
  const handleReject = (id) => {
    const pending = JSON.parse(localStorage.getItem('userSubmittedNews') || '[]');
    const updatedPending = pending.filter(p => p.id !== id);
    localStorage.setItem('userSubmittedNews', JSON.stringify(updatedPending));
    setPendingRequests(updatedPending);
    window.dispatchEvent(new Event('userNewsChanged'));
  };

  // 🗑️ Remove / Delete Approved Live News
  const handleDeleteApproved = (id) => {
    const approved = JSON.parse(localStorage.getItem('approvedNews') || '[]');
    const updatedApproved = approved.filter(item => item.id !== id);
    localStorage.setItem('approvedNews', JSON.stringify(updatedApproved));
    setApprovedNews(updatedApproved);

    // Notify App to refresh Home feed
    window.dispatchEvent(new Event('approvedNewsChanged'));
  };

  // 🔒 Admin Password Lock Screen
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
                  placeholder="Enter admin Password " 
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

  // 🛡️ Unlocked Admin Review Control Panel
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

      {/* 🧭 Admin Navigation Tabs */}
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

      {/* ⏳ TAB 1: Pending News Requests */}
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
>>>>>>> 3cc854b (Initial clean release)
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
<<<<<<< HEAD
        </Tab>
      </Tabs>
    </Container>
=======
        </>
      )}

      {/* 🔴 TAB 2: Approved / Live Published News (With Delete Option) */}
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
>>>>>>> 3cc854b (Initial clean release)
  );
}

export default AdminPanel;