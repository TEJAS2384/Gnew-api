import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaCheck, FaTimes, FaTrashAlt } from 'react-icons/fa';

function AdminPanel() {
  const [pendingList, setPendingList] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
  const [msg, setMsg] = useState('');

  // Fetch Pending & Approved News from Backend
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
    fetchData();
  }, []);

  // Approve Pending Request
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

  // Reject Pending Request
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

  // 🗑️ Delete Approved Live News
  const handleDeleteLive = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/delete-news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg("Approved news permanently deleted from Live Feed!");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="fw-bold mb-4">🛡️ Admin Dashboard</h2>

      {msg && <Alert variant="info" onClose={() => setMsg('')} dismissible>{msg}</Alert>}

      <Tabs defaultActiveKey="pending" className="mb-4">
        {/* Pending Approval Tab */}
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

        {/* Live Approved News Tab (For Deletion) */}
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