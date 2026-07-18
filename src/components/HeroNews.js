import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function HeroNews({ article }) {
  if (!article) return null;

  return (
    <Card className="border-0 shadow-lg mb-5 hero-card overflow-hidden">
      {/* g-0 etle margin/padding zero karva mate */}
      <Row className="g-0"> 
        
        {/* Left Side: Photo (Desktop ma 7 column, Mobile ma 12) */}
        <Col md={7}>
          <Card.Img
            src={article.image || "https://via.placeholder.com/800x400?text=No+Image"}
            alt={article.title}
            style={{ 
              height: "100%", 
              minHeight: "300px", 
              maxHeight: "380px", // Photo ni height limit kari didhi
              objectFit: "cover" 
            }}
          />
        </Col>

        {/* Right Side: Text & Button (Desktop ma 5 column, Mobile ma 12) */}
        <Col md={5} className="d-flex align-items-center ">
          <Card.Body className="p-4 p-lg-5">
            <span className="badge bg-danger mb-3 px-3 py-2">
              Breaking News
            </span>
            
            <Card.Title className="fw-bold mb-3" style={{ fontSize: "1.8rem", lineHeight: "1.3" }}>
              {article.title}
            </Card.Title>
            
            <Card.Text className="text-secondary mb-4" style={{ fontSize: "1.1rem" }}>
              {/* Description bahu lambu na thai jay etle cut kari didhu */}
              {article.description?.substring(0, 150)}...
            </Card.Text>
            
            <Button variant="dark" href={article.url} target="_blank">
              Read Full Article
            </Button>
          </Card.Body>
        </Col>

      </Row>
    </Card>
  );
}

export default HeroNews;