import React, { useState, useEffect } from 'react';
import { Button, Form, Badge, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaNewspaper, FaGlobe, FaBriefcase, FaLaptopCode, 
  FaFutbol, FaHeartbeat, FaAtom, FaBookmark, 
  FaPaperPlane, FaUserShield, FaBroadcastTower, FaSun, FaMoon, FaGlobeAsia,
  FaMapMarkerAlt, FaCrosshairs, FaDownload, FaWind, FaCloudSun
} from 'react-icons/fa';
import RadioNewsModal from './RadioNewsModal';

// 🌦️ Live Weather & AQI Component
function WeatherWidget({ city }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchWeatherAndAQI = async () => {
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          if (isMounted) setLoading(false);
          return;
        }

        const { latitude, longitude } = geoData.results[0];

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`);
        const weatherData = await weatherRes.json();

        const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`);
        const aqiData = await aqiRes.json();

        if (isMounted) {
          const temp = Math.round(weatherData.current?.temperature_2m ?? 30);
          const weatherCode = weatherData.current?.weather_code ?? 0;
          const aqi = aqiData.current?.us_aqi ?? 50;

          let icon = '☀️';
          let condition = 'Clear';
          if ([1, 2, 3].includes(weatherCode)) { icon = '⛅'; condition = 'Partly Cloudy'; }
          else if ([45, 48].includes(weatherCode)) { icon = '🌫️'; condition = 'Foggy'; }
          else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) { icon = '🌧️'; condition = 'Rainy'; }
          else if ([95, 96, 99].includes(weatherCode)) { icon = '🌩️'; condition = 'Thunderstorm'; }

          let aqiStatus = 'Good 🟢';
          if (aqi > 50 && aqi <= 100) { aqiStatus = 'Moderate 🟡'; }
          else if (aqi > 100 && aqi <= 150) { aqiStatus = 'Unhealthy 🟠'; }
          else if (aqi > 150) { aqiStatus = 'Hazardous 🔴'; }

          setWeather({ temp, icon, condition, aqi, aqiStatus });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeatherAndAQI();
    return () => { isMounted = false; };
  }, [city]);

  if (loading || !weather) {
    return (
      <div className="d-flex align-items-center gap-1 text-muted px-2 py-1 bg-light rounded-pill border" style={{ fontSize: '11px' }}>
        <FaCloudSun className="text-primary" /> Loading...
      </div>
    );
  }

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="weather-tooltip">
          <strong>{city} Weather:</strong> {weather.condition}<br/>
          <strong>Air Quality Index (AQI):</strong> {weather.aqi} ({weather.aqiStatus})
        </Tooltip>
      }
    >
      <div 
        className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-10 border border-primary border-opacity-25 shadow-sm"
        style={{ fontSize: '12px', cursor: 'pointer' }}
      >
        <span className="fw-bold text-primary">{weather.icon} {weather.temp}°C</span>
        <span className="text-muted">|</span>
        <span className="d-flex align-items-center gap-1 fw-semibold text-secondary">
          <FaWind className="text-info" size={11} /> AQI {weather.aqi}
        </span>
      </div>
    </OverlayTrigger>
  );
}

function AppNavbar({ language, setLanguage, darkMode, setDarkMode, newsList = [] }) {
  const [showRadio, setShowRadio] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [city, setCity] = useState(localStorage.getItem('userCity') || 'Ahmedabad');
  const [customCity, setCustomCity] = useState('');
  const [unreadSavedCount, setUnreadSavedCount] = useState(0);
  const [unreadAdminCount, setUnreadAdminCount] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    });
  };

  useEffect(() => {
    const handleCityChange = () => {
      setCity(localStorage.getItem('userCity') || 'Ahmedabad');
    };
    window.addEventListener('cityChanged', handleCityChange);
    return () => window.removeEventListener('cityChanged', handleCityChange);
  }, []);

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

  const saveCity = (newCity) => {
    if (!newCity || !newCity.trim()) return;
    const formattedCity = newCity.trim();
    localStorage.setItem('userCity', formattedCity);
    setCity(formattedCity);
    setShowLocationModal(false);
    setCustomCity('');
    window.dispatchEvent(new Event('cityChanged'));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await res.json();
            const detectedCity = data.city || data.locality || data.principalSubdivision || 'Ahmedabad';
            saveCity(detectedCity);
          } catch (err) {
            alert("Could not detect location automatically. Please enter your city manually.");
          }
        },
        () => {
          alert("Location permission was denied. Please select or type your city manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const categories = [
    { name: 'World', path: '/', icon: <FaGlobe className="text-info" /> },
    { name: `Local (${city})`, path: '/category/local', icon: <FaMapMarkerAlt className="text-danger" /> },
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
          {/* 1. LOGO */}
          <Link to="/" className="fw-bold fs-4 text-primary d-flex align-items-center gap-2 text-decoration-none me-2 flex-shrink-0">
            <FaNewspaper /> T-News
          </Link>

          {/* 2. CATEGORIES (World, Local, Business, Tech...) */}
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
                  onClick={() => {
                    if (cat.path === '/category/local' && isActive) {
                      setShowLocationModal(true);
                    }
                  }}
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

          {/* 3. RIGHT UTILITY TOOLBAR (Weather Widget, App, Language, Radio, DarkMode) */}
          <div className="d-flex align-items-center gap-2 ms-auto flex-shrink-0 ps-2">
            <WeatherWidget city={city} />

            {isInstallable && (
              <Button 
                variant="success" 
                size="sm" 
                className="fw-bold d-flex align-items-center gap-1 rounded-pill px-3 py-1 border-0 shadow-sm"
                style={{ fontSize: '13px' }}
                onClick={handleInstallApp}
              >
                <FaDownload size={11} /> App
              </Button>
            )}

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

      {/* Location Selector Modal */}
      <Modal show={showLocationModal} onHide={() => setShowLocationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">📍 Select Your Location / City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-3">Choose how you want to load local news for your city:</p>
          
          <Button 
            variant="outline-primary" 
            className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-2 mb-3 rounded-pill"
            onClick={detectLocation}
          >
            <FaCrosshairs /> Detect My Current Location
          </Button>

          <div className="text-center text-muted small mb-3">—— OR SELECT MANUALLY ——</div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Mumbai', 'Delhi', 'Bangalore', 'London', 'New York'].map((item) => (
              <Button 
                key={item} 
                variant={city.toLowerCase() === item.toLowerCase() ? "primary" : "outline-secondary"} 
                size="sm"
                className="rounded-pill"
                onClick={() => saveCity(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          <Form.Group>
            <Form.Label className="fw-semibold small">Or type any city name:</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control 
                type="text" 
                placeholder="e.g. Bhavnagar, Jamnagar, Toronto..."
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
              />
              <Button variant="primary" className="fw-bold px-4" onClick={() => saveCity(customCity)}>
                Save
              </Button>
            </div>
          </Form.Group>
        </Modal.Body>
      </Modal>

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