import React, { FC, useEffect, useState } from "react";
import { Button, Card, Form, FormGroup } from "react-bootstrap";
import { User } from "../../services/User.service";
import { useRouter } from "next/router";

interface IAccountDetailsProps {
  user: Record<string, any>;
  dispatch: any;
  addToast: any;
}

const AccountDetails: FC<IAccountDetailsProps> = ({
  user,
  dispatch,
  addToast,
}) => {
  const [accountForm, setAccountForm] = useState({
    name: user?.name || "", // Khởi tạo với giá trị mặc định
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();
  useEffect(() => {

    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);
  useEffect(() => {
    if (user) {
      setAccountForm((prevForm) => ({
        ...prevForm,
        name: user.name || "", // Cập nhật name từ user
      }));
    }
  }, [user]); // Chỉ chạy effect khi user thay đổi

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { name, oldPassword, newPassword, confirmPassword } = accountForm;

      if (!name || !oldPassword || !newPassword) {
        addToast("Please fill out all fields", {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoading(false);
        return; // Dừng nếu không có đủ thông tin
      }

      if (newPassword !== confirmPassword) {
        addToast("Passwords do not match", {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoading(false);
        return; // Dừng nếu mật khẩu không khớp
      }
      if (newPassword.length < 6) {
        addToast("Password must be at least 6 characters long", {
          appearance: "error",
          autoDismiss: true,
        });
        setIsLoading(false);
        return; // Dừng nếu mật khẩu quá ngắn
      }

      const payload = {
        name,
        oldPassword,
        newPassword,
      };
      const { success, message, result } = await User.updateUser(
        user._id,
        payload
      ); // Gọi API để cập nhật người dùng
      if (!success) {
        addToast(message, {
          appearance: "error",
          autoDismiss: true,
        });
        return; // Dừng nếu cập nhật thất bại
      }
      dispatch({
        type: "UPDATE_USER",
        payload: result,
      });
      addToast("Account updated successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      setAccountForm({
        name: result.name,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      addToast(error.message || "An error occurred", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setIsLoading(false); // Đảm bảo loading luôn tắt
    }
  };

  return (
    <Card className="mt-3">
      <Card.Header>Your Account Details</Card.Header>
      <Card.Body>
        <Form>
          <FormGroup controlId="formBasicEmail" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your fullname"
              value={accountForm.name}
              onChange={(e) =>
                setAccountForm({ ...accountForm, name: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup controlId="formBasicEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your Email"
              value={user?.email || ""}
              disabled
            />
          </FormGroup>
          <FormGroup controlId="formBasicPassword" className="mb-3">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your old password"
              value={accountForm.oldPassword}
              onChange={(e) =>
                setAccountForm({
                  ...accountForm,
                  oldPassword: e.target.value,
                })
              }
            />
          </FormGroup>
          <FormGroup controlId="formBasicPassword" className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your New password"
              value={accountForm.newPassword}
              onChange={(e) =>
                setAccountForm({
                  ...accountForm,
                  newPassword: e.target.value,
                })
              }
            />
          </FormGroup>
          <FormGroup controlId="formBasicPassword" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your New password"
              value={accountForm.confirmPassword}
              onChange={(e) =>
                setAccountForm({
                  ...accountForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </FormGroup>
          <Form.Group className="mb-3">
            <Button
              variant="info"
              type="submit"
              className="btnAuth"
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Update
            </Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AccountDetails;
