import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col, Alert, Tabs, Tab, Form, InputGroup } from 'react-bootstrap';
import { FaCheck, FaTimes, FaTrashAlt, FaLock, FaUserShield } from 'react-icons/fa';

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

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
    } else {
      setLoginError('❌ Incorrect Admin Password! Access Denied.');
    }
  };

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
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}

export default AdminPanel;