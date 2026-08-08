import React, { useState, useEffect } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FaBolt, FaTimes, FaBell, FaExternalLinkAlt } from 'react-icons/fa';
import './BreakingNewsBanner.css';

function BreakingNewsBanner({ newsList = [] }) {
  const [isVisible, setIsVisible] = useState(true);
  const [notificationGranted, setNotificationGranted] = useState(false);

  // Top Breaking Article
  const breakingArticle = newsList.length > 0 ? newsList[0] : null;

  // Request Mobile Notification Permission
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationGranted(true);
      }
    }
  }, []);

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationGranted(true);
          new Notification("T-News Mobile Alerts Activated! 🔔", {
            body: "You will now receive instant breaking news notifications on your phone.",
            icon: "%PUBLIC_URL%/favicon.svg"
          });
        }
      });
    }
  };

  // Trigger Native Phone Notification when breaking news changes
  useEffect(() => {
    if (notificationGranted && breakingArticle) {
      try {
        new Notification(`🔥 BREAKING: ${breakingArticle.title}`, {
          body: breakingArticle.description || "Tap to read full breaking news update.",
          icon: breakingArticle.image || "%PUBLIC_URL%/favicon.svg"
        });
      } catch (e) {
        console.log("Notification trigger error");
      }
    }
  }, [breakingArticle, notificationGranted]);

  if (!isVisible || !breakingArticle) return null;

  return (
    <div className="container my-3">
      <div className="breaking-banner-container p-2 px-3 shadow-md d-flex align-items-center justify-content-between gap-2">
        
        {/* Left: Pulse Badge + Title */}
        <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
          <span className="breaking-pulse-badge d-flex align-items-center gap-1 flex-shrink-0">
            <FaBolt /> BREAKING
          </span>

          <span className="fw-semibold text-truncate breaking-title text-light" style={{ fontSize: '14.5px' }}>
            {breakingArticle.title}
          </span>
        </div>

        {/* Right: Actions (Notification Bell, Read Button, Close) */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          
          {/* Mobile Push Notification Enable Bell */}
          {!notificationGranted && (
            <Button 
              variant="outline-warning" 
              size="sm" 
              className="rounded-circle p-1 d-flex align-items-center justify-content-center border-0 text-warning"
              title="Enable Mobile Notifications"
              onClick={requestNotificationPermission}
              style={{ width: '32px', height: '32px' }}
            >
              <FaBell size={14} />
            </Button>
          )}

          {/* Read Article Button */}
          <a 
            href={breakingArticle.url || "#"} 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-sm btn-danger fw-bold rounded-pill px-3 py-1 d-flex align-items-center gap-1"
            style={{ fontSize: '12px' }}
          >
            Read <FaExternalLinkAlt size={10} />
          </a>

          {/* Dismiss Button */}
          <Button 
            variant="link" 
            className="text-white opacity-75 p-0 ms-1"
            onClick={() => setIsVisible(false)}
          >
            <FaTimes size={15} />
          </Button>

        </div>

      </div>
    </div>
  );
}

export default BreakingNewsBanner;