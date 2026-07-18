import Container from "react-bootstrap/Container";
import BootstrapNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"; // <-- Button import karyu
import { FaNewspaper } from "react-icons/fa";

function Navbar({ category, setCategory, language, setLanguage, darkMode, setDarkMode }) {
  
  const activeStyle = (currentCategory) => {
    return category === currentCategory
      ? { 
          fontWeight: "bold", 
          color: "#3b82f6", 
          borderBottom: "2px solid #3b82f6", 
          paddingBottom: "5px" 
        }
      : { 
          color: "rgba(255, 255, 255, 0.6)" 
        };
  };

  return (
    <BootstrapNavbar expand="lg" bg="dark" variant="dark" sticky="top" className="shadow px-3">
      <Container fluid> 
        
        <BootstrapNavbar.Brand style={{ fontWeight: "bold", fontSize: "28px" }}>
          <FaNewspaper className="me-2" />G-News
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle />

        <BootstrapNavbar.Collapse>
          <Nav className="me-auto ms-lg-4" style={{ gap: "10px" }}> 
            <Nav.Link onClick={() => setCategory("general")} style={activeStyle("general")}>General</Nav.Link>
            <Nav.Link onClick={() => setCategory("world")} style={activeStyle("world")}>World</Nav.Link>
            <Nav.Link onClick={() => setCategory("business")} style={activeStyle("business")}>Business</Nav.Link>
            <Nav.Link onClick={() => setCategory("technology")} style={activeStyle("technology")}>Technology</Nav.Link>
            <Nav.Link onClick={() => setCategory("sports")} style={activeStyle("sports")}>Sports</Nav.Link>
            <Nav.Link onClick={() => setCategory("health")} style={activeStyle("health")}>Health</Nav.Link>
            <Nav.Link onClick={() => setCategory("science")} style={activeStyle("science")}>Science</Nav.Link>
          </Nav>

          {/* Ahiya Language Selection ane Dark Mode Toggle banne ne sathe mukiya chhe */}
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            <Form.Select
              style={{ width: "150px", cursor: "pointer", fontWeight: "500" }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
              <option value="mr">Marathi</option>
            </Form.Select>

            {/* Dark/Light Mode no Emoji Button */}
            <Button
              variant={darkMode ? "outline-light" : "outline-warning"}
              onClick={() => setDarkMode(!darkMode)}
              className="ms-3 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "42px", height: "42px", fontSize: "20px", border: "none" }}
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
          </div>

        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;