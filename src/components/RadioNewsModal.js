import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Badge, ButtonGroup } from 'react-bootstrap';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaBroadcastTower, FaVolumeUp } from 'react-icons/fa';

const GNEWS_API_KEY = process.env.REACT_APP_GNEWS_API_KEY || "b890dfdbc88d6283fbd54075e88eccaa";

function RadioNewsModal({ show, onHide }) {
  const [language, setLanguage] = useState('en');
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeVoiceName, setActiveVoiceName] = useState('Default Voice');
  const [voices, setVoices] = useState([]);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // 1. Load Speech Voices properly
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };
    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // 2. Fetch Top 15 Live News
  useEffect(() => {
    if (!show) {
      stopAudio();
      setIsPlaying(false);
      return;
    }

    setLoading(true);
    stopAudio();
    setIsPlaying(false);
    setCurrentIndex(0);

    const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=${language}&max=15&apikey=${GNEWS_API_KEY}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Radio News Fetch Error:", err);
        setLoading(false);
      });
  }, [language, show]);

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleClose = () => {
    stopAudio();
    setIsPlaying(false);
    onHide();
  };

  // 🔊 Clean & Reliable Speech Engine
  const speakArticle = (index) => {
    stopAudio();

    if (!('speechSynthesis' in window) || articles.length === 0) return;

    if (index >= articles.length) {
      setIsPlaying(false);
      return;
    }

    const current = articles[index];
    const introText = language === 'gu' 
      ? `મુખ્ય સમાચાર ${index + 1}: ` 
      : language === 'hi' 
      ? `मुख्य समाचार ${index + 1}: ` 
      : `Headline ${index + 1}: `;

    const cleanTitle = current.title ? current.title.replace(/[\/\(\)\{\}\[\]]/g, '') : '';
    const cleanDesc = current.description ? current.description.substring(0, 180).replace(/[\/\(\)\{\}\[\]]/g, '') : '';
    const fullText = `${introText} ${cleanTitle}. ${cleanDesc}`;

    // 100ms delay prevents Chrome speech cancel bug
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(fullText);
      const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();

      if (language === 'gu') {
        utterance.lang = 'gu-IN';
        const guVoice = availableVoices.find(v => v.lang.toLowerCase().includes('gu')) ||
                        availableVoices.find(v => v.lang.toLowerCase().includes('hi') && v.name.includes('Google')) ||
                        availableVoices.find(v => v.lang.toLowerCase().includes('hi'));

        if (guVoice) {
          utterance.voice = guVoice;
          setActiveVoiceName(guVoice.name || "Gujarati Voice 🎙️");
        } else {
          setActiveVoiceName("Gujarati Speech Engine 🎙️");
        }
      } else if (language === 'hi') {
        utterance.lang = 'hi-IN';
        const hiVoice = availableVoices.find(v => v.lang.toLowerCase().includes('hi') && v.name.includes('Google')) ||
                        availableVoices.find(v => v.lang.toLowerCase().includes('hi'));
        if (hiVoice) utterance.voice = hiVoice;
        setActiveVoiceName(hiVoice?.name || "Google Hindi Voice 🎙️");
      } else {
        utterance.lang = 'en-US';
        const enVoice = availableVoices.find(v => v.name.includes('Google') && v.lang.toLowerCase().includes('en')) ||
                        availableVoices.find(v => v.name.includes('Natural') && v.lang.toLowerCase().includes('en')) ||
                        availableVoices.find(v => v.lang.toLowerCase().includes('en'));
        if (enVoice) utterance.voice = enVoice;
        setActiveVoiceName(enVoice?.name || "Google English Voice 🎙️");
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        if (isPlayingRef.current && index + 1 < articles.length) {
          setCurrentIndex(index + 1);
          speakArticle(index + 1);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      speakArticle(currentIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < articles.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (isPlaying) speakArticle(nextIdx);
    }
  };

  const handlePrev = () => {
    if (currentIndex - 1 >= 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      if (isPlaying) speakArticle(prevIdx);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title className="fs-6 fw-bold d-flex align-items-center gap-2">
          <FaBroadcastTower className="text-danger animate-pulse" size={22} />
          G-News Live Audio Radio
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark text-white p-4">
        {/* 🌍 3 Languages Switcher */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <Badge bg="danger" className="px-3 py-2 fs-7 d-flex align-items-center gap-1">
            <FaVolumeUp /> TOP 15 DAILY BULLETIN
          </Badge>

          <ButtonGroup size="sm">
            <Button 
              variant={language === 'en' ? 'primary' : 'outline-light'} 
              onClick={() => setLanguage('en')}
            >
              English 🇬🇧
            </Button>
            <Button 
              variant={language === 'hi' ? 'primary' : 'outline-light'} 
              onClick={() => setLanguage('hi')}
            >
              हिन्दी 🇮🇳
            </Button>
            <Button 
              variant={language === 'gu' ? 'primary' : 'outline-light'} 
              onClick={() => setLanguage('gu')}
            >
              ગુજરાતી 🇮🇳
            </Button>
          </ButtonGroup>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="mt-3 text-secondary">Tuning into Live Radio Feed ({language.toUpperCase()})...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <p>No Radio Headlines available right now. Please try switching language.</p>
          </div>
        ) : (
          <div>
            {/* 📻 Live Radio Visualizer Card */}
            <div className="card bg-secondary bg-opacity-25 border-secondary text-white p-4 rounded-4 mb-4 text-center position-relative overflow-hidden">
              <span className="badge bg-danger position-absolute top-0 end-0 m-3 px-2 py-1 fs-8">
                {isPlaying ? "🔴 LIVE BROADCASTING" : "⏸️ PAUSED"}
              </span>

              <h6 className="text-info fw-bold mb-2">
                HEADLINE {currentIndex + 1} OF {articles.length}
              </h6>

              <h4 className="fw-bold mb-3" style={{ lineHeight: '1.4' }}>
                {articles[currentIndex]?.title}
              </h4>

              <p className="text-light opacity-75 small mb-3">
                {articles[currentIndex]?.description || "Listen to today's daily top updates live on G-News Radio."}
              </p>

              <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                🎙️ Audio Engine: {activeVoiceName}
              </small>
            </div>

            {/* 🎛️ Radio Player Controls */}
            <div className="d-flex justify-content-center align-items-center gap-3 my-3">
              <Button 
                variant="outline-light" 
                className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px' }}
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <FaStepBackward size={18} />
              </Button>

              <Button 
                variant={isPlaying ? "danger" : "success"} 
                className="rounded-circle p-3 d-flex align-items-center justify-content-center shadow-lg"
                style={{ width: '65px', height: '65px' }}
                onClick={togglePlay}
              >
                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ms-1" />}
              </Button>

              <Button 
                variant="outline-light" 
                className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px' }}
                onClick={handleNext}
                disabled={currentIndex === articles.length - 1}
              >
                <FaStepForward size={18} />
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default RadioNewsModal;