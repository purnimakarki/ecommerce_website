import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import { useGetProductsQuery } from "../slices/productSlice";
import Message from "../components/Message";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import Loader from '../components/Loader';

const HomePage = () => {
  const { keyword, pageNumber, category } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <Meta />
      {!keyword && <ProductCarousel />}
      {keyword ? <h2>Search Results</h2> : <h2>Latest Products</h2>}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || 'An error occurred'}</Message>
      ) : (
        <>
          <Row>
            {data?.products?.map((product) => (
              <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            page={data?.page}
            pages={data?.pages}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomePage;
