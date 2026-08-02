import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function HeroNews({ article }) {
  if (!article) return null;

  // Safe Default Fallback Image
  const defaultImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";

  return (
    <Card className="border-0 shadow-lg mb-5 hero-card overflow-hidden">
      <Row className="g-0"> 
        
        {/* Left Side: Photo */}
        <Col md={7}>
          <Card.Img
            src={article.image || defaultImage}
            alt={article.title}
            style={{ 
              height: "100%", 
              minHeight: "300px", 
              maxHeight: "380px", 
              objectFit: "cover" 
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </Col>

        {/* Right Side: Text & Button */}
        <Col md={5} className="d-flex align-items-center">
          <Card.Body className="p-4 p-lg-5">
            <span className="badge bg-danger mb-3 px-3 py-2">
              Breaking News
            </span>
            
            <Card.Title className="fw-bold mb-3" style={{ fontSize: "1.8rem", lineHeight: "1.3" }}>
              {article.title}
            </Card.Title>
            
            <Card.Text className="text-secondary mb-4" style={{ fontSize: "1.1rem" }}>
              {article.description?.substring(0, 150)}...
            </Card.Text>
            
            <Button variant="dark" href={article.url || "#"} target={article.url ? "_blank" : "_self"}>
              Read Full Article
            </Button>
          </Card.Body>
        </Col>

      </Row>
    </Card>
  );
}

export default HeroNews;