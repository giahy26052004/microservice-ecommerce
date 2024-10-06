import styled, { css } from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  while?: boolean;
  outline?: boolean;
  black?: boolean;
  primary?: boolean;
  size?: "s" | "m" | "l"; // Adjust sizes as needed
}

export const ButtonStyle = css<ButtonProps>`
  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  display: inline-flex;
  text-decoration: none;
  align-items: center;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-weight: 400;

  svg {
    height: 16px;
    margin-right: 5px;
  }

  ${(props) =>
    props.block &&
    css`
      display: block;
      width: 100%;
    `}

  ${(props) =>
    props.while &&
    !props.outline &&
    css`
      background-color: #fff;
      color: #000;
    `}
  
  ${(props) =>
    props.while &&
    props.outline &&
    css`
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
    `}
  
  ${(props) =>
    props.black &&
    !props.outline &&
    css`
      background-color: #000;
      color: #fff;
    `}
  
  ${(props) =>
    props.black &&
    props.outline &&
    css`
      background-color: transparent;
      color: #000;
      border: 1px solid #000;
    `}
  
  ${(props) =>
    props.primary &&
    !props.outline &&
    css`
      background-color: #fafafa;
      color: #fff;
      border: 1px solid #fafafa;
    `}
  
  ${(props) =>
    props.primary &&
    props.outline &&
    css`
      background-color: transparent;
      color: #fafafa;
      border: 1px solid #fafafa;
    `}
  
  ${(props) =>
    props.size === "l" &&
    css`
      font-size: 1.2rem;
      padding: 10px 20px;
      svg {
        height: 20px;
      }
    `}
`;

const StyledButton = styled.button<ButtonProps>`
  ${ButtonStyle}
`;

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
};

export default Button;
