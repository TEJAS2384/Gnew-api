import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";

function NewsCard({ article }) {
  if (!article) return null;

  return (
    <Card className="news-card h-100 shadow-sm border-0">
      <div className="image-box" style={{ overflow: "hidden" }}>
        <Card.Img
          variant="top"
          src={article.image || "https://via.placeholder.com/400x200?text=No+Image"}
          alt={article.title}
          className="news-image"
          style={{ height: "200px", objectFit: "cover", transition: "transform 0.3s" }}
        />
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
        
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
          <small className="text-muted">
            <FaCalendarAlt className="me-1" />
            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Today"}
          </small>
          <Button variant="outline-dark" size="sm" href={article.url} target="_blank">
            Read <FaExternalLinkAlt className="ms-1" size={12} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default NewsCard;