import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaNewspaper, 
  FaMoon, 
  FaSun, 
  FaBroadcastTower, 
  FaStop,
  FaHome,
  FaGlobe,
  FaBriefcase,
  FaLaptopCode,
  FaFutbol,
  FaHeartbeat,
  FaFlask,
  FaBookmark,
  FaPaperPlane,
  FaUserShield
} from 'react-icons/fa';

function AppNavbar({ language, setLanguage, darkMode, setDarkMode }) {
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);

  // 📻 Hands-Free Auto-Play Radio Mode
  const handleRadioMode = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingRadio) {
      window.speechSynthesis.cancel();
      setIsPlayingRadio(false);
      return;
    }

    const sampleHeadlines = [
      "Welcome to G-News Radio.",
      "Top Story 1: Global Stock Markets Show Positive Growth in Q3.",
      "Top Story 2: Major Breakthrough in Renewable Solar Energy Storage.",
      "Top Story 3: India Advances Big in AI and Space Innovations.",
      "That concludes the top news radio briefing."
    ];

    setIsPlayingRadio(true);
    window.speechSynthesis.cancel();

    sampleHeadlines.forEach((text, index) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      if (index === sampleHeadlines.length - 1) {
        utterance.onend = () => setIsPlayingRadio(false);
      }
      window.speechSynthesis.speak(utterance);
    });
  };

  return (
    <Navbar bg={darkMode ? "dark" : "white"} variant={darkMode ? "dark" : "light"} className="shadow-sm sticky-top py-2">
      <Container fluid className="px-2 px-md-3 d-flex align-items-center justify-content-between flex-nowrap">
        
        {/* Left Side: Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-5 text-primary d-flex align-items-center gap-1 me-2" style={{ whiteSpace: 'nowrap' }}>
          <FaNewspaper size={20} /> G-News
        </Navbar.Brand>

        {/* Center: Horizontal Scroll Bar with All Categories */}
        <div className="d-flex align-items-center overflow-x-auto flex-grow-1 mx-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', whiteSpace: 'nowrap' }}>
          <Nav className="fw-semibold gap-1 flex-row align-items-center">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaHome size={13} /> General
            </Nav.Link>
            <Nav.Link as={Link} to="/category/world" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaGlobe size={13} /> World
            </Nav.Link>
            <Nav.Link as={Link} to="/category/business" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaBriefcase size={13} /> Business
            </Nav.Link>
            <Nav.Link as={Link} to="/category/technology" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaLaptopCode size={13} /> Tech
            </Nav.Link>
            <Nav.Link as={Link} to="/category/sports" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaFutbol size={13} /> Sports
            </Nav.Link>
            <Nav.Link as={Link} to="/category/health" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaHeartbeat size={13} /> Health
            </Nav.Link>
            <Nav.Link as={Link} to="/category/science" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaFlask size={13} /> Science
            </Nav.Link>
            <Nav.Link as={Link} to="/saved" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaBookmark size={13} /> Saved
            </Nav.Link>
            <Nav.Link as={Link} to="/submit-news" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaPaperPlane size={13} /> Submit
            </Nav.Link>
            <Nav.Link as={Link} to="/admin" className="d-flex align-items-center gap-1 px-2 py-1 fs-7">
              <FaUserShield size={13} /> Admin
            </Nav.Link>
          </Nav>
        </div>

        {/* Right Side Controls */}
        <div className="d-flex align-items-center gap-1 flex-nowrap" style={{ whiteSpace: 'nowrap' }}>
          {/* Radio Button */}
          <Button 
            variant={isPlayingRadio ? "danger" : "outline-success"} 
            size="sm" 
            className="fw-bold d-flex align-items-center gap-1 px-2 py-1"
            onClick={handleRadioMode}
            style={{ fontSize: '12px' }}
          >
            {isPlayingRadio ? <FaStop size={11} /> : <FaBroadcastTower size={11} />} 
            {isPlayingRadio ? "Stop" : "Radio"}
          </Button>

          {/* Language Selector */}
          <Form.Select 
            size="sm" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ width: '82px', fontSize: '12px', padding: '2px 4px' }}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="gu">Gujarati</option>
          </Form.Select>

          {/* Dark Mode Toggle */}
          <Button 
            variant={darkMode ? "light" : "dark"} 
            size="sm" 
            onClick={() => setDarkMode(!darkMode)}
            className="px-2 py-1"
          >
            {darkMode ? <FaSun size={13} /> : <FaMoon size={13} />}
          </Button>
        </div>

      </Container>
    </Navbar>
  );
}

export default AppNavbar;