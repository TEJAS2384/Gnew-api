import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { FaBroadcastTower, FaPlay, FaPause, FaStepForward } from 'react-icons/fa';

function RadioNewsModal({ show, onHide, newsList = [], language = 'en' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeArticles = newsList.length > 0 ? newsList.slice(0, 15) : [];

  useEffect(() => {
    if (!show) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    }
  }, [show]);

  const speakHeadline = (index) => {
    if (!('speechSynthesis' in window) || activeArticles.length === 0) return;

    window.speechSynthesis.cancel();
    const article = activeArticles[index];
    if (!article) return;

    const text = `Headline ${index + 1}: ${article.title}`;
    const utterance = new SpeechSynthesisUtterance(text);

    // Precise Voice & Language Selection Logic
    if (language === 'gu') {
      utterance.lang = 'gu-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    const voices = window.speechSynthesis.getVoices();
    const targetLang = language === 'gu' ? 'gu' : language === 'hi' ? 'hi' : 'en';
    const matchedVoice = voices.find(v => v.lang.toLowerCase().includes(targetLang));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.rate = 0.9;

    utterance.onend = () => {
      if (index + 1 < activeArticles.length) {
        setCurrentIndex(index + 1);
        speakHeadline(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speakHeadline(currentIndex);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % activeArticles.length;
    setCurrentIndex(nextIdx);
    if (isPlaying) {
      speakHeadline(nextIdx);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2 text-danger">
          <FaBroadcastTower /> G-News Live Audio Radio Bulletin
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white p-4">
        {activeArticles.length === 0 ? (
          <div className="text-center py-4 text-warning">
            <h5>📻 Loading Live Radio Headlines... Please wait a second.</h5>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <Badge bg="danger" className="px-3 py-2 fs-6">
                🎙️ Bulletin {currentIndex + 1} of {activeArticles.length}
              </Badge>
              <div className="d-flex gap-2">
                <Button variant={isPlaying ? "warning" : "success"} onClick={handlePlayPause} className="fw-bold px-4">
                  {isPlaying ? <><FaPause className="me-1" /> Pause Radio</> : <><FaPlay className="me-1" /> Play Radio</>}
                </Button>
                <Button variant="light" onClick={handleNext} className="fw-bold">
                  <FaStepForward className="me-1" /> Next
                </Button>
              </div>
            </div>

            <div className="p-3 bg-secondary bg-opacity-25 rounded-3 border border-secondary mb-3">
              <h5 className="fw-bold text-light mb-2">{activeArticles[currentIndex]?.title}</h5>
              <p className="text-secondary small mb-0">{activeArticles[currentIndex]?.description}</p>
            </div>

            <div className="small text-muted">
              <h6 className="text-light fw-bold mb-2">📻 Up Next in Bulletin:</h6>
              <ol className="ps-3 mb-0" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {activeArticles.map((art, i) => (
                  <li key={i} className={i === currentIndex ? "text-warning fw-bold mb-1" : "text-secondary mb-1"}>
                    {art.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default RadioNewsModal;