import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { FaExternalLinkAlt, FaVolumeUp, FaBookmark, FaRegBookmark, FaWhatsapp, FaCopy, FaCheck } from "react-icons/fa";

function NewsCard({ article }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop";

  useEffect(() => {
    if (article && article.title) {
      try {
        const saved = JSON.parse(localStorage.getItem("bookmarkedNews") || "[]");
        const exists = saved.some((item) => item.title === article.title);
        setIsBookmarked(exists);
      } catch (e) {
        console.error(e);
      }
    }
  }, [article]);

  if (!article) return null;

  // 🔊 Text-to-Speech
  const handleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const textToRead = `${article.title}. ${article.description || ''}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      alert("Taro browser Voice feature support nathi karto.");
    }
  };

  // 🔖 Bookmark Toggle
  const toggleBookmark = () => {
    try {
      let saved = JSON.parse(localStorage.getItem("bookmarkedNews") || "[]");
      if (isBookmarked) {
        saved = saved.filter((item) => item.title !== article.title);
        setIsBookmarked(false);
      } else {
        saved.push(article);
        setIsBookmarked(true);
      }
      localStorage.setItem("bookmarkedNews", JSON.stringify(saved));
    } catch (e) {
      console.error(e);
    }
  };

  // 📲 WhatsApp Share
  const shareOnWhatsapp = () => {
    const shareText = encodeURIComponent(`*${article.title}*\n\nRead more on G-News: ${article.url || window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  // 📋 Copy Link
  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="news-card h-100 shadow-sm border-0 position-relative">
      <div className="image-box position-relative" style={{ overflow: "hidden" }}>
        <Card.Img
          variant="top"
          src={article.image || defaultImage}
          alt={article.title}
          className="news-image"
          style={{ height: "200px", objectFit: "cover", transition: "transform 0.3s" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />

        {/* Bookmark Button */}
        <Button
          variant="light"
          size="sm"
          onClick={toggleBookmark}
          className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
          style={{ width: "35px", height: "35px" }}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark News"}
        >
          {isBookmarked ? <FaBookmark className="text-warning" /> : <FaRegBookmark />}
        </Button>
      </div>

      <Card.Body className="d-flex flex-column">
        <div>
          <Badge bg="danger" className="mb-2">Latest</Badge>
          <Card.Title className="news-title fw-bold" style={{ fontSize: "1.1rem" }}>
            {article.title}
          </Card.Title>
          <Card.Text className="news-description text-muted" style={{ fontSize: "0.9rem" }}>
            {article.description?.substring(0, 100)}...
          </Card.Text>
        </div>
        
        {/* Action Bar */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
          <div className="d-flex gap-2">
            {/* Voice Listen Button */}
            <Button 
              variant={isSpeaking ? "danger" : "outline-primary"} 
              size="sm" 
              onClick={handleSpeech}
              title="Listen News"
            >
              <FaVolumeUp /> {isSpeaking ? "Stop" : "Listen"}
            </Button>

            {/* WhatsApp Share */}
            <Button 
              variant="outline-success" 
              size="sm" 
              onClick={shareOnWhatsapp}
              title="Share on WhatsApp"
            >
              <FaWhatsapp size={15} />
            </Button>

            {/* Copy Link */}
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={copyLink}
              title="Copy Link"
            >
              {copied ? <FaCheck className="text-success" /> : <FaCopy />}
            </Button>
          </div>

          <Button variant="outline-dark" size="sm" href={article.url || "#"} target="_blank">
            Read <FaExternalLinkAlt className="ms-1" size={12} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default NewsCard;