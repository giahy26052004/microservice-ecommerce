import React, { FC, useContext, useEffect, useState } from "react";
import { Button, Card, Form, FormControl, FormGroup } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import validator from "validator";
import { User } from "../../services/User.service";
import { useRouter } from "next/router";
import { Context } from "../../context";
import { stringify } from "querystring";

interface IRegisterLoginProps {
  isRegisterForm?: boolean; // optional prop to control registration form visibility
}
const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
};
const RegisterLogin: FC<IRegisterLoginProps> = ({ isRegisterForm = false }) => {
  const { addToast } = useToasts();
  const [authForm, setAuthForm] = useState(initialForm);
  const [otpForm, setOtpForm] = useState({ otp: "", email: "" });
  const [otpTime, setOtpTime] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    if (user && user?.email) {
      router.push("/my-account");
    }
  });
  const handleRegisterForm = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { name, email, password, confirmPassword } = authForm;
      if (password !== confirmPassword) {
        throw new Error("Password and confirm password does not match");
      }
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }
      if (password.length < 6)
        throw new Error("Password should be at least 6 characters long");
      if (!validator.isEmail(email)) {
        throw new Error("Please enter a valid email address");
      }
      const payload = {
        name,
        email,
        password,
        type: "customer",
      };
      const { success, message, result } = await User.createUser(payload);
      if (success) {
        setOtpForm({ otp: "", email: payload.email });
        setOtpTime(true);
        addToast(message, { appearance: "success", autoDismiss: true });
      } else {
        return addToast(message, { appearance: "error", autoDismiss: true });
      }
    } catch (error: any) {
      if (error?.response) {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismisstrue: true,
        });
      }
      addToast(error.message, {
        appearance: "error",
        autoDismisstrue: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginForm = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { email, password } = authForm;
      if (!email || !password) {
        throw new Error("All fields are required");
      }
      if (!validator.isEmail(email)) {
        throw new Error("Please enter a valid email address");
      }
      const payload = {
        email,
        password,
        type: "customer",
      };
      const { success, message, result } = await User.loginUser(payload);
      if (success) {
        setAuthForm(initialForm);
        localStorage.setItem("_micro_user", JSON.stringify(result));
        dispatch({
          type: "LOGIN",
          payload: result,
        });
        addToast(message, { appearance: "success", autoDismiss: true });
        router.push("/my-account");
      } else {
        return addToast(message, { appearance: "error", autoDismiss: true });
      }
    } catch (error: any) {
      if (error?.response) {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismisstrue: true,
        });
      }
    }
  };
  const handleReSend = async () => {
    try {
      setIsLoading(true);
      const { success, message } = await User.forgotPassword(authForm.email);
      if (success) {
        addToast(message, { appearance: "success", autoDismisstrue: true });
      } else {
        addToast(message, { appearance: "error", autoDismisstrue: true });
      }
      addToast(message, { appearance: "success", autoDismisstrue: true });
    } catch (error: any) {
      addToast(error.message, {
        appearance: "error",
        autoDismisstrue: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerify = async () => {
    try {
      setIsLoading(true);
      const { otp, email } = otpForm;
      const data = {
        otp,
        email: authForm.email,
        password: authForm.password,
      };
      const { success, message } = await User.confirmForgot(data);
      if (success) {
        setAuthForm(initialForm);
        addToast(message, { appearance: "success", autoDismisstrue: true });
      } else {
        addToast(message, { appearance: "error", autoDismisstrue: true });
      }
    } catch (error: any) {
      addToast(error.message, { appearance: "error", autoDismisstrue: true });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card>
      <Card.Header>{isRegisterForm ? "Register" : "Login"}</Card.Header>
      <Card.Body>
        {isRegisterForm && (
          <Form.Group>
            <Form.Label>FullName</Form.Label>
            <FormControl
              type="text"
              placeholder="Enter full name"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm({ ...authForm, name: e.target.value })
              }
            />
          </Form.Group>
        )}
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <FormControl
            type="email"
            placeholder="Enter email address"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <FormControl
            type="password"
            placeholder="Enter password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
          />
        </Form.Group>
        {isRegisterForm && (
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <FormControl
              type="password"
              placeholder="Enter confirmPassword"
              value={authForm.confirmPassword}
              onChange={(e) =>
                setAuthForm({ ...authForm, confirmPassword: e.target.value })
              }
            />
          </Form.Group>
        )}
        {otpTime && (
          <Form.Group className="mb-3">
            <Form.Label>OTP</Form.Label>
            <FormControl
              type="text"
              placeholder="Enter OTP"
              value={otpForm.otp}
              onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
            />
            <Button
              onClick={handleReSend}
              variant="link"
              className="resendOtpBtn"
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              ReSend OTP
            </Button>
          </Form.Group>
        )}
        {otpTime ? (
          <Button
            variant="info"
            type="submit"
            disabled={isLoading}
            onClick={handleVerify}
            className="btnAuth"
          >
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Verify
          </Button>
        ) : (
          <Button
            variant="info"
            type="submit"
            disabled={isLoading}
            className="btnAuth"
            style={{ margin: "10px 0" }}
            onClick={(e) =>
              isRegisterForm ? handleRegisterForm(e) : handleLoginForm(e)
            }
          >
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {isRegisterForm ? "Register" : "Login"}
          </Button>
        )}
        {!isRegisterForm && (
          <div
            onClick={async () => {
              addToast("Waitting Resent OTP verify your email...", {
                appearance: "info",
                autoDismisstrue: true,
              });
              if (authForm.email) {
                await handleReSend();
                setOtpTime(true);
              } else {
                addToast("Please enter your email address", {
                  appearance: "error",
                  autoDismisstrue: true,
                });
              }
            }}
            style={{
              textDecoration: "none",
              cursor: "pointer",
              marginTop: "5px",
              color: "#770707",
            }}
          >
            Forgot Password
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RegisterLogin;
