import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import Spinner, { RingLoaderIcon } from "./spinner";
import CountdownTimer from "./countdownTimer";
import { Orders } from "../services/Order.service";

const ModalContainer = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: #00183b;
  width: 400px;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5% auto;
  margin-top: 120px;
  border: 1px solid #888;
`;

const ImageContent = styled.div`
  margin-bottom: 20px;
  text-align: center;
  span {
    line-height: 40px;
    margin-left: 40px;
    font-family: sans-serif;
    font-weight: 700;
  }
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 600;
  font-family: sans-serif;
  margin-bottom: 4px;
  text-align: center;

  @media screen and (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ImageStyled = styled.img`
  width: 16rem;
  height: 16rem;
  padding-left: 2.5rem;

  @media screen and (min-width: 768px) {
    width: 20rem;
    height: 20rem;
  }
`;

const CloseButton = styled.span`
  color: #fff;
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin-right: 20px;

  &:hover,
  &:focus {
    color: black;
    cursor: pointer;
  }
`;

const WrapperInfo = styled.div`
  width: 100%;
`;

const WrapperSuccess = styled.div`
  height: 20rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleSuccess = styled.span`
  font-size: 2rem;
  font-weight: 700;
  font-family: sans-serif;
  margin-bottom: 4px;
  text-align: center;
`;

const RingLoaderStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px;
`;
const SpinnerStyled = styled.div`
  margin-bottom: -50px;
  margin-left: -1.5px;

  @media screen and (min-width: 768px) {
    margin-bottom: -20px;
    margin-left: -1.5px;
  }
`;

interface PaymentInfo {
  orderId: string;
  user: string;
  cartItems: Array<{ quantity: number; price: number }>;
  customerPhoneNumber: string;
  name: string;
  email: string;
  city: string;
  streetAddress: string;
  orderStatus: string;
}

interface ModalProps {
  showModal: boolean;
  handleClose: () => void;
  paymentInfo: PaymentInfo | null;
  MY_BANK: { BANK_ID: string; ACCOUNT_NO: string };
  setShowModal: (show: boolean) => void;
  submitForm: () => void;
}

export const ModalFrom: React.FC<ModalProps> = ({
  showModal,
  handleClose,
  paymentInfo,
  MY_BANK,
  setShowModal,
  submitForm,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const NDCK = `${paymentInfo?.name}${Date.now().toString().slice(-6)}`;

  const handleCloseSuccess = () => {
    submitForm();
    setShowModal(false);
  };

  const quantity =
    paymentInfo?.cartItems
      .map((item) => Number(item.price) * Number(item.quantity))
      .reduce((a, b) => a + b, 0) || 0;

  const paidPrice = quantity;
  const QR = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact.png?amount=${paidPrice}&addInfo=${NDCK}`;

  const checkPaid = useCallback(
    async (price: number, description: string) => {
      if (isSuccess) return;

      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbycseqrT8DrVp5DpIig-zOs__YJ8xKn8-tAIaQw6nchkRYpwdZ4qof_JexJ0PnEmg5U/exec"
        );
        const data = await response.json();
        const lastPaid = data.data[data.data.length - 1];
        const lastPrice = lastPaid["Giá trị"];
        const lastContent = lastPaid["Mô tả"];

        if (lastPrice >= price && lastContent === description) {
          setIsSuccess(true);
          if (paymentInfo) {
            await Orders.checkout(paymentInfo);
          } else {
            console.error("Payment info is null");
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [isSuccess, paymentInfo]
  );
  useEffect(() => {
    let idSetInCheckPay: NodeJS.Timeout | undefined;

    if (showModal) {
      const timeoutId = setTimeout(() => {
        idSetInCheckPay = setInterval(() => {
          checkPaid(paidPrice, quantity.toString());
        }, 2000);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
        if (idSetInCheckPay) {
          clearInterval(idSetInCheckPay);
        }
      };
    }
  }, [showModal, checkPaid, paidPrice, quantity]);

  return (
    <ModalContainer show={showModal}>
      <ModalContent>
        {!isSuccess ? (
          <>
            <WrapperInfo>
              <ImageContent>
                <span>Quét mã để thanh toán </span>
                <ImageStyled src={QR} />
              </ImageContent>
              <Title>
                Nội dung chuyển khoản: <span>{NDCK}</span>
              </Title>
              <Title>
                Số tiền: <span>{`${quantity}`}</span>
              </Title>
              <CountdownTimer
                submitForm={submitForm}
                initialTime={600}
                setShowModal={setShowModal}
                showModal={showModal}
              />
              <SpinnerStyled>
                <Spinner />
              </SpinnerStyled>
            </WrapperInfo>
            <CloseButton onClick={handleClose}>&times;</CloseButton>
          </>
        ) : (
          <WrapperSuccess>
            <TitleSuccess>
              <RingLoaderStyled>
                <RingLoaderIcon />
              </RingLoaderStyled>
              <CountdownTimer
                submitForm={submitForm}
                initialTime={5}
                setShowModal={setShowModal}
                showModal={showModal}
                title="Your order has been successfully paid"
              />
            </TitleSuccess>
            <CloseButton onClick={handleCloseSuccess}>
              <span>&times;</span>
            </CloseButton>
          </WrapperSuccess>
        )}
      </ModalContent>
    </ModalContainer>
  );
};
