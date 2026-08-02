import React from "react";
import Container from "react-bootstrap/Container";
import BootstrapNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaNewspaper, FaPlusCircle, FaUserShield, FaBookmark } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

function Navbar({ language, setLanguage, darkMode, setDarkMode }) {
  const categories = ["general", "world", "business", "technology", "sports", "health", "science"];

  return (
    <BootstrapNavbar bg="dark" variant="dark" sticky="top" className="shadow px-2 py-2 w-100">
      <Container fluid className="d-flex align-items-center justify-content-between p-0"> 
        
        {/* Logo - Click karvathi Home par jase */}
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold fs-5 d-flex align-items-center ms-2 me-3 text-white">
          <FaNewspaper className="me-2 text-primary" />G-News
        </BootstrapNavbar.Brand>

        {/* Categories Strip */}
        <div 
          className="d-flex align-items-center overflow-auto flex-grow-1 me-2" 
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", whiteSpace: "nowrap" }}
        >
          <Nav className="d-flex flex-row align-items-center" style={{ gap: "14px" }}> 
            {categories.map((cat) => (
              <Nav.Link 
                key={cat} 
                as={NavLink} 
                to={`/category/${cat}`}
                className={({ isActive }) => (isActive ? "fw-bold text-primary border-bottom border-primary pb-1" : "text-white-50")}
                style={{ textTransform: "capitalize", fontSize: "0.95rem" }}
              >
                {cat}
              </Nav.Link>
            ))}

            <Nav.Link as={NavLink} to="/saved" className={({ isActive }) => (isActive ? "fw-bold text-warning" : "text-warning opacity-75")}>
              <FaBookmark className="me-1" /> Saved
            </Nav.Link>

            <Nav.Link as={NavLink} to="/submit-news" className={({ isActive }) => (isActive ? "fw-bold text-success" : "text-success opacity-75")}>
              <FaPlusCircle className="me-1" /> Submit
            </Nav.Link>

            <Nav.Link as={NavLink} to="/admin" className={({ isActive }) => (isActive ? "fw-bold text-info" : "text-info opacity-75")}>
              <FaUserShield className="me-1" /> Admin
            </Nav.Link>
          </Nav>
        </div>

        {/* Language & Dark Mode */}
        <div className="d-flex align-items-center gap-2 me-2" style={{ flexShrink: 0 }}>
          <Form.Select
            size="sm"
            style={{ width: "100px", cursor: "pointer", fontWeight: "500", fontSize: "13px" }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="gu">Gujarati</option>
            <option value="mr">Marathi</option>
          </Form.Select>

          <Button
            variant={darkMode ? "outline-light" : "outline-warning"}
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-circle d-flex align-items-center justify-content-center p-0"
            style={{ width: "35px", height: "35px", fontSize: "15px", border: "none" }}
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </Button>
        </div>

      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;