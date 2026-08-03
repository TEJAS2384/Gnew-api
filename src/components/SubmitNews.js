import React, { useState } from 'react';
<<<<<<< HEAD
import { Card, Form, Button, Alert, Container, InputGroup } from 'react-bootstrap';
import { FaPaperPlane, FaLock } from 'react-icons/fa';
=======
import { Card, Form, Button, Alert } from 'react-bootstrap';
>>>>>>> 3cc854b (Initial clean release)

function SubmitNews() {
  const [formData, setFormData] = useState({
    title: '',
<<<<<<< HEAD
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
=======
    description: '',
    category: 'general',
    author: '',
    image: '',
    submitPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Security Check for Submit Password
    if (formData.submitPassword !== 'submit123') {
      setErrorMsg('❌ Incorrect Submit Password! Please enter valid authorization password.');
      return;
    }

    if (!formData.title || !formData.description) return;

    const newArticle = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      author: formData.author || 'Anonymous',
      image: formData.image,
      status: 'pending',
      date: new Date().toLocaleDateString()
    };

    // Save to LocalStorage
    const existing = JSON.parse(localStorage.getItem('userSubmittedNews') || '[]');
    const updated = [newArticle, ...existing];
    localStorage.setItem('userSubmittedNews', JSON.stringify(updated));

    // Dispatch event so Navbar Admin Badge updates instantly
    window.dispatchEvent(new Event('userNewsChanged'));

    setSubmitted(true);
    setFormData({ 
      title: '', 
      description: '', 
      category: 'general', 
      author: '', 
      image: '', 
      submitPassword: '' 
    });

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="container my-5" style={{ maxWidth: '650px' }}>
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
        <Card.Header className="bg-primary text-white text-center py-3">
          <h4 className="fw-bold mb-0">🚀 Submit Latest News Request</h4>
        </Card.Header>
        <Card.Body className="p-4">
          {submitted && (
            <Alert variant="success" className="rounded-3 shadow-sm">
              ✅ News submitted successfully! Sent to Admin panel for review.
            </Alert>
          )}

          {errorMsg && (
            <Alert variant="danger" className="rounded-3 shadow-sm">
              {errorMsg}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Article Title *</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter compelling headline..." 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
>>>>>>> 3cc854b (Initial clean release)
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="general">General</option>
<<<<<<< HEAD
                <option value="technology">Technology</option>
                <option value="sports">Sports</option>
                <option value="business">Business</option>
=======
                <option value="world">World</option>
                <option value="business">Business</option>
                <option value="tech">Tech</option>
                <option value="sports">Sports</option>
>>>>>>> 3cc854b (Initial clean release)
                <option value="health">Health</option>
                <option value="science">Science</option>
              </Form.Select>
            </Form.Group>

<<<<<<< HEAD
            <Form.Group className="col-md-6 mb-3">
              <Form.Label className="fw-bold">Author Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Your name" 
                required
=======
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">News Description / Content *</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Write news summary or details..." 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Author Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Your Name or Bureau Name" 
>>>>>>> 3cc854b (Initial clean release)
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </Form.Group>
<<<<<<< HEAD
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
=======

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Image URL (Optional)</Form.Label>
              <Form.Control 
                type="url" 
                placeholder="https://images.unsplash.com/..." 
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </Form.Group>

            {/* 🔑 Security Submit Password Field */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-danger">🔒 Submit Security Password *</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter submit password" 
                value={formData.submitPassword}
                onChange={(e) => setFormData({ ...formData, submitPassword: e.target.value })}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 fw-bold py-2 rounded-pill shadow">
              📤 Send to Admin
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
>>>>>>> 3cc854b (Initial clean release)
  );
}

export default SubmitNews;