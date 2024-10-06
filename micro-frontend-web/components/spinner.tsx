import styled from "styled-components";
import { BarLoader, RingLoader } from "react-spinners";

// Styled component for BarLoader with media queries
const StyledBarLoader = styled(BarLoader)`
  margin: 20px auto;

  /* Media queries for responsiveness */
  @media (max-width: 768px) {
    width: 540px;
  }

  @media (max-width: 480px) {
    width: 200px;
  }
`;

// Function component for RingLoader
export default function Spinner() {
  return (
    <StyledBarLoader
      color={"#0c6af7"}
      width={440}
      height={5}
      speedMultiplier={0.7}
    />
  );
}
export function RingLoaderIcon() {
  return <RingLoader color="#0bec43" />;
}
