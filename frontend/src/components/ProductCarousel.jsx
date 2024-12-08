import { Carousel, Image } from "react-bootstrap";
import { useGetTopProductsQuery } from "../slices/productSlice";
import Message from "./Message";
import { Link } from "react-router-dom";

function ProductCarousel() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <></>
  ) : error ? (
    <Message variant="danger">{error.data.error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark mb-4">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} fluid />
          </Link>
          <Carousel.Caption className="carousel-caption">
            {product.name} - (${product.price})
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
