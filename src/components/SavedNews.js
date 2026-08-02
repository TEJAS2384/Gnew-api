import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import NewsCard from './NewsCard';
import { FaBookmark } from 'react-icons/fa';

function SavedNews() {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem('bookmarkedNews') || '[]');
    setSavedArticles(articles);
  }, []);

  return (
    <Container className="my-5" style={{ minHeight: '60vh' }}>
      <div className="d-flex align-items-center mb-4">
        <FaBookmark className="text-warning me-2 fs-3" />
        <h2 className="fw-bold m-0">Your Saved Articles</h2>
      </div>

      {savedArticles.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm">
          <h4>No saved news yet!</h4>
          <p className="text-muted">Click the bookmark icon on any news card to save it for later.</p>
        </Card>
      ) : (
        <Row className="g-4">
          {savedArticles.map((article, index) => (
            <Col md={4} key={index}>
              <NewsCard article={article} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SavedNews;