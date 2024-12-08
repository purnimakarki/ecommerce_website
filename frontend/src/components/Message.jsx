import { Alert } from "react-bootstrap";

function Message({ variant = "primary", children }) {
  return <Alert variant={variant}>{children}</Alert>;
}

export default Message;
