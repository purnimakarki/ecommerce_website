import { useState, useEffect } from "react";
import FormContainer from "../../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productSlice";
import { toast } from "react-toastify";

function ProductEditPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [countInStock, setCountInStock] = useState("");

  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: productUpdateLoading }] =
    useUpdateProductMutation();
  const [uploadProductImage, { isLoading: imageUploadLoading }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setBrand(product.brand);
      setCategory(product.category);
      setPrice(product.price);
      setCountInStock(product.countInStock);
    }
  }, [product]);

  const updateProductHandler = async (e) => {
    e.preventDefault();
    try {
      let resp = await updateProduct({
        _id: product._id,
        name,
        brand,
        image,
        category,
        price,
        countInStock,
        description,
      }).unwrap();
      toast.success(resp.message);
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.data.error);
    }
  };
  const uploadImageHandler = async (e) => {
    try {
      let formData = new FormData();
      formData.append("image", e.target.files[0]);
      let resp = await uploadProductImage(formData).unwrap();
      setImage(resp.filepath);
      toast.success(resp.message);
    } catch (err) {
      toast.error(err.data.error);
    }
  };
  return (
    <>
      <FormContainer>
        <h3 className="mb-3">Edit Product</h3>
        <Form onSubmit={updateProductHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="brand" className="my-2">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="category" className="my-2">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" onChange={uploadImageHandler} />
          </Form.Group>
          <Form.Group controlId="price" className="my-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="countInStock" className="my-2">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="description" className="my-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="dark" className="my-2">
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
}

export default ProductEditPage;
