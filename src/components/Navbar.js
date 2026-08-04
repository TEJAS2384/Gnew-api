import React, { useState, useEffect } from 'react';
import { Button, Form, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaNewspaper, FaGlobe, FaBriefcase, FaLaptopCode, 
  FaFutbol, FaHeartbeat, FaAtom, FaBookmark, 
  FaPaperPlane, FaUserShield, FaBroadcastTower, FaSun, FaMoon, FaGlobeAsia 
} from 'react-icons/fa';
import RadioNewsModal from './RadioNewsModal';

function AppNavbar({ language, setLanguage, darkMode, setDarkMode, newsList = [] }) {
  const [showRadio, setShowRadio] = useState(false);
  const [unreadSavedCount, setUnreadSavedCount] = useState(0);
  const [unreadAdminCount, setUnreadAdminCount] = useState(0);
  const location = useLocation();

  const updateCounts = () => {
    const saved = JSON.parse(localStorage.getItem('savedNews') || '[]');
    const lastSeenSaved = parseInt(localStorage.getItem('lastSeenSavedCount') || '0', 10);

    if (location.pathname === '/saved') {
      localStorage.setItem('lastSeenSavedCount', saved.length.toString());
      setUnreadSavedCount(0);
    } else {
      const diff = saved.length - lastSeenSaved;
      setUnreadSavedCount(diff > 0 ? diff : 0);
    }

    const userNews = JSON.parse(localStorage.getItem('userSubmittedNews') || '[]');
    const lastSeenAdmin = parseInt(localStorage.getItem('lastSeenAdminCount') || '0', 10);

    if (location.pathname === '/admin') {
      localStorage.setItem('lastSeenAdminCount', userNews.length.toString());
      setUnreadAdminCount(0);
    } else {
      const diff = userNews.length - lastSeenAdmin;
      setUnreadAdminCount(diff > 0 ? diff : 0);
    }
  };

  useEffect(() => {
    updateCounts();
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('savedNewsChanged', updateCounts);
    window.addEventListener('userNewsChanged', updateCounts);
    return () => {
      window.removeEventListener('savedNewsChanged', updateCounts);
      window.removeEventListener('userNewsChanged', updateCounts);
    };
  }, [location.pathname]);

  const categories = [
    { name: 'General', path: '/', icon: <FaGlobe className="text-primary" /> },
    { name: 'World', path: '/category/world', icon: <FaGlobe className="text-info" /> },
    { name: 'Business', path: '/category/business', icon: <FaBriefcase className="text-success" /> },
    { name: 'Tech', path: '/category/tech', icon: <FaLaptopCode className="text-warning" /> },
    { name: 'Sports', path: '/category/sports', icon: <FaFutbol className="text-danger" /> },
    { name: 'Health', path: '/category/health', icon: <FaHeartbeat className="text-danger" /> },
    { name: 'Science', path: '/category/science', icon: <FaAtom className="text-info" /> },
    { name: 'Saved', path: '/saved', icon: <FaBookmark className="text-warning" />, badge: unreadSavedCount },
    { name: 'Submit', path: '/submit-news', icon: <FaPaperPlane className="text-primary" /> },
    { name: 'Admin', path: '/admin', icon: <FaUserShield className="text-secondary" />, badge: unreadAdminCount },
  ];

  return (
    <>
      <nav 
        className={`sticky-top shadow-sm px-3 py-2 ${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'}`}
        style={{ borderBottom: darkMode ? '1px solid #333' : '1px solid #e5e7eb' }}
      >
        <div className="d-flex align-items-center gap-3 overflow-x-auto text-nowrap" style={{ scrollbarWidth: 'none' }}>
          <Link to="/" className="fw-bold fs-4 text-primary d-flex align-items-center gap-2 text-decoration-none me-2 flex-shrink-0">
            <FaNewspaper /> G-News
          </Link>

          <div className="d-flex align-items-center gap-2 flex-shrink-0 fw-semibold">
            {categories.map((cat, idx) => {
              const isActive = location.pathname === cat.path;
              return (
                <Link
                  key={idx}
                  to={cat.path}
                  className={`btn btn-sm d-flex align-items-center gap-1 border-0 rounded-pill px-3 py-1 position-relative ${
                    isActive 
                      ? (darkMode ? 'btn-secondary text-white' : 'btn-light text-primary fw-bold') 
                      : (darkMode ? 'text-light' : 'text-dark')
                  }`}
                  style={{ fontSize: '13.5px' }}
                >
                  {cat.icon} {cat.name}
                  {cat.badge > 0 && (
                    <Badge bg="danger" pill className="ms-1 shadow-sm border border-light" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {cat.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="d-flex align-items-center gap-2 ms-auto flex-shrink-0 ps-2">
            <div 
              className={`position-relative rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm ${
                darkMode ? 'bg-secondary bg-opacity-25 text-white' : 'bg-light text-dark'
              }`}
              style={{ width: '36px', height: '36px', cursor: 'pointer' }}
              title="Change Language"
            >
              <FaGlobeAsia className="text-primary" size={18} />
              <Form.Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                style={{ cursor: 'pointer' }}
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिन्दी</option>
                <option value="gu">🇮🇳 ગુજરાતી</option>
              </Form.Select>
            </div>

            <Button 
              variant="danger" 
              size="sm" 
              className="fw-bold d-flex align-items-center gap-2 rounded-pill px-3 py-1 border-0 shadow-sm"
              style={{ fontSize: '13px', background: 'linear-gradient(135deg, #dc3545 0%, #b02a37 100%)' }}
              onClick={() => setShowRadio(true)}
            >
              <FaBroadcastTower /> Radio
            </Button>

            <Button 
              variant={darkMode ? "light" : "dark"} 
              size="sm" 
              className="rounded-circle p-2 d-flex align-items-center justify-content-center border-0 shadow-sm"
              style={{ width: '36px', height: '36px' }}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <FaSun className="text-warning" /> : <FaMoon />}
            </Button>
          </div>
        </div>
      </nav>

      <RadioNewsModal 
        show={showRadio} 
        onHide={() => setShowRadio(false)} 
        newsList={newsList}
        language={language}
      />
    </>
  );
}

export default AppNavbar;