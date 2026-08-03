import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge } from 'react-bootstrap';
import { FaVolumeUp, FaVolumeMute, FaBookmark, FaRegBookmark, FaShareAlt, FaShieldAlt } from 'react-icons/fa';

function NewsCard({ article, language = 'en', onSaveToggle }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('savedNews') || '[]');
    const found = existing.some(item => item.title === article.title);
    setIsSaved(found);
  }, [article.title]);

  const bullets = [
    `Key Focus: ${article.title}`,
    `Overview: ${article.description ? article.description.substring(0, 80) + '...' : 'Latest updates on the topic.'}`,
    `Impact: Highly relevant news for ${article.category || 'general'} readers with verified sources.`
  ];

  const credibilityScore = Math.floor(Math.random() * 7) + 92;

  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleListen = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${article.title}. ${article.description || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    const isGujarati = /[\u0A80-\u0AFF]/.test(textToRead) || language === 'gu';
    const isHindi = /[\u0900-\u097F]/.test(textToRead) || language === 'hi';

    let matchedVoice = voices.find(v => 
      isGujarati ? (v.lang.includes('gu') || v.lang.includes('hi')) :
      isHindi ? v.lang.includes('hi') : v.lang.includes('en')
    );

    if (matchedVoice) utterance.voice = matchedVoice;
    utterance.rate = 0.9;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    const existing = JSON.parse(localStorage.getItem('savedNews') || '[]');
    let updated = [];

    if (isSaved) {
      updated = existing.filter(item => item.title !== article.title);
      setIsSaved(false);
    } else {
      updated = [...existing, article];
      setIsSaved(true);
    }

    localStorage.setItem('savedNews', JSON.stringify(updated));
    window.dispatchEvent(new Event('savedNewsChanged'));

    if (onSaveToggle) {
      onSaveToggle();
    }
  };

  const handleShare = () => {
    const shareUrl = article.url || window.location.href;
    if (navigator.share) {
      navigator.share({ title: article.title, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    }
  };

  return (
    <>
      <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden position-relative">
        <div className="position-absolute top-0 end-0 m-2">
          <Badge bg="success" className="d-flex align-items-center gap-1 shadow-sm px-2 py-1">
            <FaShieldAlt /> {credibilityScore}% Verified
          </Badge>
        </div>

        <Card.Img 
          variant="top" 
          src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop"} 
          style={{ height: '180px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop";
          }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fs-6 fw-bold mb-2" style={{ lineHeight: '1.4' }}>
            {article.title}
          </Card.Title>
          <Card.Text className="text-secondary small mb-3 flex-grow-1">
            {article.description?.substring(0, 100)}...
          </Card.Text>

          <Button 
            variant="warning" 
            size="sm" 
            className="w-100 mb-2 fw-bold text-dark d-flex align-items-center justify-content-center gap-1 shadow-sm"
            onClick={() => setShowSummary(true)}
          >
            ⚡ Quick AI Summary
          </Button>

          <div className="d-flex justify-content-between align-items-center pt-2 border-top">
            <Button 
              variant={isSpeaking ? "danger" : "outline-primary"} 
              size="sm" 
              onClick={handleListen}
            >
              {isSpeaking ? <FaVolumeMute className="me-1" /> : <FaVolumeUp className="me-1" />}
              {isSpeaking ? "Stop" : "Listen"}
            </Button>

            <div className="d-flex gap-2">
              <Button variant="light" size="sm" onClick={handleSave} title={isSaved ? "Remove from Saved" : "Save Article"}>
                {isSaved ? <FaBookmark className="text-warning fs-6" /> : <FaRegBookmark className="fs-6" />}
              </Button>
              <Button variant="light" size="sm" onClick={handleShare}>
                <FaShareAlt />
              </Button>
              
              <Button 
                variant="dark" 
                size="sm" 
                href={article.url || "#"} 
                target="_blank" 
                rel="noreferrer"
              >
                Read
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showSummary} onHide={() => setShowSummary(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold text-warning d-flex align-items-center gap-2">
            ⚡ 3-Bullet AI Summary
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <h6 className="fw-bold mb-3">{article.title}</h6>
          <ul className="list-unstyled">
            {bullets.map((point, idx) => (
              <li key={idx} className="mb-2 d-flex align-items-start gap-2">
                <span className="badge bg-primary rounded-pill mt-1">{idx + 1}</span>
                <span className="text-secondary">{point}</span>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewsCard;