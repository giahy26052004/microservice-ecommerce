import React, { useContext, useEffect } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { Context } from "../context";
import { User } from "../services/User.service";
import AccountDetails from "../components/MyAccounts/AccountDetails";
import Router from "next/router";

const MyAccount = () => {
  const { addToast } = useToasts();
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  useEffect(() => {
    if (!user || !user.email) {
      Router.push("/auth"); // if user already logged in redirect to my account
    }
  }, [user]);
  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      dispatch({ type: "LOGOUT", payload: null });
      await User.logoutUser();
      localStorage.removeItem("_micro_user");
    } catch (error: any) {
      addToast(error.message, { appearance: "error", autoDismisstrue: true });
    }
  };
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey={"first"}>
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">Account Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">All order</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third" onClick={(e) => handleLogout(e)}>
                Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey={"first"}>
              <AccountDetails
                user={user}
                dispatch={dispatch}
                addToast={addToast}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"second"}>
              <h1>All Orders</h1>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default MyAccount;
