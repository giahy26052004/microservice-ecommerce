import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useContext } from "react";
import { Badge } from "react-bootstrap";
import { Button, Card, CloseButton, Image, Offcanvas } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { useToasts } from "react-toast-notifications";
import { Context } from "../context";
import CartItems from "./CartItems";
import { Orders } from "../services/Order.service";

interface IProps {
  show: boolean;
  setShow: (show: boolean) => void;
}
const CartOffCanvas: FC<IProps> = ({ show, setShow }: IProps) => {
  const handleClose = () => setShow(false);
  const { addToast } = useToasts();
  const router = useRouter();
  const { cartItems, cartDispatch } = useContext(Context);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      if (cartItems.length > 0) {
        router.push("/checkout");

        // });
      }
    } catch (error: any) {
      addToast(`Something went wrong. Please try again. ! ,${error}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Shoping Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CartItems />
          <Button
            variant="primary"
            style={{ width: "100%" }}
            disabled={isLoading}
            onClick={
              () => handleCheckout()
              // 	{
              // 	setShow(false);
              // 	router.push('/checkout');
              // }
            }
          >
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Checkout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CartOffCanvas;
