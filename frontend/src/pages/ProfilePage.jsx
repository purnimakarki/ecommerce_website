import { Form, Row, Col, Button, Table } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { useUpdateUserProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/orderSlice";
import Message from "../components/Message";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateUserProfile, { isLoading: updateProfileLoading }] =
    useUpdateUserProfileMutation();
  const {
    data: orders,
    isLoading: ordersLoading,
    error,
  } = useGetMyOrdersQuery();
  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.name, userInfo.email]);

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      if (password != confirmPassword) {
        toast.error("Password not matched");
      } else {
        let resp = await updateUserProfile({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(resp.user));
        toast.success(resp.message);
      }
    } catch (err) {
      toast.error(err.data.error);
    }
  };
  return (
    <Row>
      <Col md={4}>
        <h3>Profile</h3>
        <Form onSubmit={updateProfileHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email" className="my-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Control
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="confirmpassword" className="my-3">
            <Form.Control
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="dark">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={8}>
        <h3>My Orders</h3>
        {ordersLoading ? (
          <h1>Loading...</h1>
        ) : error ? (
          <Message variant="danger">{error.data.error}</Message>
        ) : (
          <Table responsive striped hover className="table-sm">
            <thead>
              <tr>
                <th>Id</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Delivered</th>
                <th>Paid</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isPaid ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <Button variant="dark" size="sm" rounded>
                        Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfilePage;
