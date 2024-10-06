import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Form,
  InputGroup,
  Nav,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import styles from "../../styles/Home.module.css";
import { PersonCircle, Search } from "react-bootstrap-icons";
import { Context } from "../../context";
import CartOffCanvas from "../CartOffCanvas";
const TopHeading = () => {
  const router = useRouter();
  const [show, setShow] = React.useState(false);
  const [searchText, setSearchText] = useState("");
  const [baseType, setBaseType] = useState("Products");
  const {
    state: { user },
    cartItems,
  } = useContext(Context);
  const search = () => {
    router.push(`/products?search=${searchText}`);
  };
  return (
    <>
      <Row className="mt-3">
        <Col xs={6} md={4}>
          <h3 className={styles.logoHeading} onClick={() => router.push("/")}>
            HyShop
          </h3>
        </Col>
        <Col xs={6} md={4}>
          {" "}
          <InputGroup>
            <InputGroup.Text id="inputGroup-sizing-default">
              <Search />
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Search the product here..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && search()}
            />
            <Button
              onClick={() => search()}
              variant="outline-success"
              id="button-addon2"
            >
              Search
            </Button>
          </InputGroup>
        </Col>
        <Col xs={6} md={4}>
          <PersonCircle
            height="40"
            width="40"
            color="#4c575f"
            onClick={() => router.push("/my-account")}
            className={styles.personIcon}
          />
        </Col>
      </Row>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="light"
        variant="light"
        color="#4c575f"
      >
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => router.push("/")}>Home</Nav.Link>
            <NavDropdown
              onSelect={(e) => {
                setBaseType(e as string);
                e === "All"
                  ? router.push(`/products`)
                  : router.push(`/products?baseType=${e}`);
              }}
              title={baseType}
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item eventKey={"Computer"}>
                Computer
              </NavDropdown.Item>
              <NavDropdown.Item eventKey={"Mobile"}>Mobile</NavDropdown.Item>
              <NavDropdown.Item eventKey={"All"}>All</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link
              className={styles.cartItems}
              onClick={() => setShow(true)}
            >
              Items: <Badge bg="secondary">{cartItems.length}</Badge> (₹
              {cartItems
                .map(
                  (item: { quantity: number; price: number }) =>
                    Number(item.price) * Number(item.quantity)
                )
                .reduce((a: number, b: number) => a + b, 0)}
              )
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <CartOffCanvas setShow={setShow} show={show} />
    </>
  );
};

export default TopHeading;
