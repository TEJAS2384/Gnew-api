import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaBolt, FaTimes, FaBell, FaExternalLinkAlt } from 'react-icons/fa';
import './BreakingNewsBanner.css';

function BreakingNewsBanner({ newsList = [] }) {
  const [isVisible, setIsVisible] = useState(true);
  const [notificationGranted, setNotificationGranted] = useState(false);

  const breakingArticle = newsList.length > 0 ? newsList[0] : null;

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationGranted(true);
      }
    }
  }, []);

  // Request Mobile Notification Permission + Set App Badge
  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationGranted(true);

          // Set Badge '1' on Phone App Icon
          if ('setAppBadge' in navigator) {
            navigator.setAppBadge(1).catch(() => {});
          }

          if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification("T-News Mobile Alerts Activated! 🔔", {
                body: "You will now receive instant breaking news notifications on your phone.",
                icon: "/favicon.svg",
                badge: "/favicon.svg"
              });
            });
          } else {
            new Notification("T-News Mobile Alerts Activated! 🔔", {
              body: "You will now receive instant breaking news notifications on your phone.",
              icon: "/favicon.svg"
            });
          }
        }
      });
    }
  };

  // Trigger Native Phone Notification & Icon Badge on Breaking News
  useEffect(() => {
    if (notificationGranted && breakingArticle) {
      // 🔴 Update App Icon Badge on Phone Screen
      if ('setAppBadge' in navigator) {
        navigator.setAppBadge(newsList.length > 5 ? 5 : newsList.length).catch(() => {});
      }

      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(`🔥 BREAKING: ${breakingArticle.title}`, {
            body: breakingArticle.description || "Tap to read full breaking news update.",
            icon: breakingArticle.image || "/favicon.svg",
            badge: "/favicon.svg",
            vibrate: [200, 100, 200]
          });
        });
      }
    }
  }, [breakingArticle, notificationGranted, newsList]);

  // Clear Badge when Banner is Closed/Read
  const handleDismiss = () => {
    setIsVisible(false);
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch(() => {});
    }
  };

  if (!isVisible || !breakingArticle) return null;

  return (
    <div className="container my-3">
      <div className="breaking-banner-container p-2 px-3 shadow-md d-flex align-items-center justify-content-between gap-2">
        
        <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
          <span className="breaking-pulse-badge d-flex align-items-center gap-1 flex-shrink-0">
            <FaBolt /> BREAKING
          </span>

          <span className="fw-semibold text-truncate breaking-title text-light" style={{ fontSize: '14.5px' }}>
            {breakingArticle.title}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          
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

          <a 
            href={breakingArticle.url || "#"} 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-sm btn-danger fw-bold rounded-pill px-3 py-1 d-flex align-items-center gap-1"
            style={{ fontSize: '12px' }}
            onClick={() => {
              if ('clearAppBadge' in navigator) navigator.clearAppBadge().catch(() => {});
            }}
          >
            Read <FaExternalLinkAlt size={10} />
          </a>

          <Button 
            variant="link" 
            className="text-white opacity-75 p-0 ms-1"
            onClick={handleDismiss}
          >
            <FaTimes size={15} />
          </Button>

        </div>

      </div>
    </div>
  );
}

export default BreakingNewsBanner;