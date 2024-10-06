import { useEffect, useState } from "react";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.1rem;
  padding: 10px;
  margin-left: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  h2 {
    font-size: 1.5rem;
    margin: 18px;
  }
`;

interface CountdownTimerProps {
  title?: string;
  initialTime: number; // Time in seconds
  setShowModal: (show: boolean) => void;
  showModal: boolean;
  submitForm: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  title,
  initialTime,
  setShowModal,
  showModal,
  submitForm,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (showModal) {
      setTimeLeft(initialTime); // Reset timeLeft when modal is opened
    }
  }, [showModal, initialTime]);

  useEffect(() => {
    if (timeLeft === 0) {
      setShowModal(false);
      submitForm(); // Submit form when time runs out
      return;
    }

    // Set interval to decrease time every second
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Cleanup interval on unmount or when timeLeft changes
    return () => clearInterval(intervalId);
  }, [timeLeft, setShowModal, submitForm]);

  // Convert time left to mm:ss format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <Wrapper>
      <Title>{title ? title : "Đang chờ thanh toán"}</Title>
      <h2>{formatTime(timeLeft)}</h2>
    </Wrapper>
  );
};

export default CountdownTimer;
