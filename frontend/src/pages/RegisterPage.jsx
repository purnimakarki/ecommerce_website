import { useState, useEffect } from "react";
import { FormGroup, Form, Button, Row, Col, Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";

const RegisterPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      let resp = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(resp.user));
      toast.success(resp.message);
      navigate("/");
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card className="p-4 my-3" style={{ backgroundColor: "#f8f9fa", borderColor: "#007bff" ,borderRadius:'20px',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',backgroundcolor:'black'}}>
            <h2 className="text-center" style={{ color: "#007bff" }}>Register</h2>
            <Form onSubmit={submitHandler}>
              <FormGroup controlId="name" className="my-3">
                <Form.Label style={{ color: "#17a2b8" }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderColor: "#17a2b8" }}
                ></Form.Control>
              </FormGroup>
              <FormGroup controlId="email" className="my-3">
                <Form.Label style={{ color: "#17a2b8" }}>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderColor: "#17a2b8" }}
                ></Form.Control>
              </FormGroup>
              <FormGroup controlId="password" className="my-3">
                <Form.Label style={{ color: "#17a2b8" }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderColor: "#17a2b8" }}
                ></Form.Control>
              </FormGroup>
              <FormGroup controlId="confirmPassword" className="my-3">
                <Form.Label style={{ color: "#17a2b8" }}>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ borderColor: "#17a2b8" }}
                ></Form.Control>
              </FormGroup>
              <Button
                type="submit"
                variant="primary"
                className="w-100 mt-3"
                disabled={isLoading}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Register
              </Button>
            </Form>
            <Row className="py-3">
              <Col className="text-center">
                Have an Account? <Link to="/signin" style={{ color: "#007bff" }}>Login</Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;