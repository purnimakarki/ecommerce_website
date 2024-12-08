import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

function Product({ product }) {
  // Add logging to debug image path
  console.log('Image path:', product.image);
  
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img
          variant="top"
          src={product.image} // Use the full path from database
          alt={product.name}
          onError={(e) => {
            console.log('Image failed to load:', product.image);
            e.target.onerror = null;
            e.target.src = '/images/default.jpg';
          }}
        />
      </Link>
      <Card.Body>
        <Card.Text as="div" className="product-title">
          <Link to={`/product/${product._id}`}>
            <strong>{product.name}</strong>
          </Link>
        </Card.Text>
        <Card.Text as="div">
          <Rating value={product.rating} text={product.numReviews} />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
