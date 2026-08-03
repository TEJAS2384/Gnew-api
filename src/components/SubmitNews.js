import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function SubmitNews() {
  const [formData, setFormData] = useState({
    title: '',
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

    if (formData.submitPassword !== 'submit123') {
      setErrorMsg('❌ Incorrect Submit Password! Please enter valid authorization password (submit123).');
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

    const existing = JSON.parse(localStorage.getItem('userSubmittedNews') || '[]');
    const updated = [newArticle, ...existing];
    localStorage.setItem('userSubmittedNews', JSON.stringify(updated));

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
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="world">World</option>
                <option value="business">Business</option>
                <option value="tech">Tech</option>
                <option value="sports">Sports</option>
                <option value="health">Health</option>
                <option value="science">Science</option>
              </Form.Select>
            </Form.Group>

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
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Image URL (Optional)</Form.Label>
              <Form.Control 
                type="url" 
                placeholder="https://images.unsplash.com/..." 
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-danger">🔒 Submit Security Password *</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter submit password (submit123)" 
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
  );
}

export default SubmitNews;