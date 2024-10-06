import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { Context } from "../context";
import "../styles/Product.module.css"; // Import tệp CSS
import { ModalFrom } from "../components/modal";
import { useToasts } from "react-toast-notifications";

const CartPage: React.FC = () => {
  const {
    state: { user },
    cartItems,
  } = useContext(Context);
  const MY_BANK = {
    BANK_ID: "MB",
    ACCOUNT_NO: "0989807405",
  };

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: uuidv4(),
    user: user,
    cartItems: cartItems,
    customerPhoneNumber: phone,
    name,
    email,
    city,
    streetAddress,
    orderStatus: "PENDING",
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowModal(true);
  };
  const { addToast } = useToasts();
  const submitForm = async () => {
    const formData = {
      orderId: uuidv4(),
      user: user._id,
      cartItems: cartItems,
      customerPhoneNumber: phone,
      name,
      email,
      city,
      streetAddress,
      orderStatus: "PENDING",
    };
    setPaymentInfo(formData);
    if (
      !formData.cartItems ||
      !formData.customerPhoneNumber ||
      !name ||
      !email ||
      !city ||
      !streetAddress
    ) {
      addToast("the field form not value", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="container">
      <h2 className="title">CheckOut Information</h2>
      <Form id="checkoutForm" onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            required
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your city"
            value={city}
            onChange={(ev) => setCity(ev.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formStreetAddress">
          <Form.Label>Street Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your street address"
            value={streetAddress}
            onChange={(ev) => setStreetAddress(ev.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(ev) => setPhone(ev.target.value)}
          />
        </Form.Group>

        <Button
          type="submit"
          onClick={() => {
            submitForm();
          }}
          style={{ marginTop: "20px" }}
        >
          Continue to payment
        </Button>
      </Form>
      <ModalFrom
        showModal={showModal}
        submitForm={submitForm}
        handleClose={handleClose}
        setShowModal={setShowModal}
        paymentInfo={paymentInfo}
        MY_BANK={MY_BANK}
      />
    </div>
  );
};

export default CartPage;
