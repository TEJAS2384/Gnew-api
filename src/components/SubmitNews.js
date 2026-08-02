import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, InputGroup } from 'react-bootstrap';
import { FaPaperPlane, FaLock } from 'react-icons/fa';

function SubmitNews() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    author: '',
    image: '',
    description: '',
    pin: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Secret Security PIN (Tame potano custom PIN rachi sako cho)
  const SECRET_PIN = "232323";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setErrorMsg('');

    // Security PIN Validation
    if (formData.pin !== SECRET_PIN) {
      setErrorMsg('❌ Invalid Security PIN! You need the secret PIN  to submit news.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/submit-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ title: '', category: 'general', author: '', image: '', description: '', pin: '' });
      } else {
        setErrorMsg('Failed to submit news to server.');
      }
    } catch (error) {
      console.error("Error submitting news:", error);
      setErrorMsg('Backend Server Offline! Make sure "node server.js" is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '650px' }}>
      <Card className="shadow-lg border-0 p-4 rounded-4">
        <h3 className="fw-bold text-center mb-4 text-primary">📰 Submit News Request</h3>
        
        {submitted && (
          <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
            <strong>Success!</strong> Request validated with Security PIN & sent to Express Backend.
          </Alert>
        )}

        {errorMsg && (
          <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>
            {errorMsg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">News Title</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter news heading..." 
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </Form.Group>

          <div className="row">
            <Form.Group className="col-md-6 mb-3">
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="technology">Technology</option>
                <option value="sports">Sports</option>
                <option value="business">Business</option>
                <option value="health">Health</option>
                <option value="science">Science</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="col-md-6 mb-3">
              <Form.Label className="fw-bold">Author Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Your name" 
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Image URL</Form.Label>
            <Form.Control 
              type="url" 
              placeholder="https://images.unsplash.com/photo-..." 
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">News Description / Details</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Write full news content..." 
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>

          {/* 🔐 Security PIN Field */}
          <Form.Group className="mb-4">
            
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control 
                type="password" 
                placeholder="Enter 4-digit security PIN" 
                required
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
              />
            </InputGroup>
            <Form.Text className="text-muted">Prevents unauthorized fake news spamming.</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" disabled={loading}>
            <FaPaperPlane className="me-2" /> {loading ? "Verifying..." : "Submit to Backend"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default SubmitNews;