import styled from "styled-components";
import ChatBot from "./chatbot";
// Adjust the path as per your project structure

// Styled container to center the chatbot
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Full height */
  background: rgba(0, 0, 0, 0.05); /* Light background */
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
`;

// Styled chatbox container (you can define additional styles here)
const ChatBoxContainer = styled.div`
  width: 400px; /* Set a width for the chatbox */
  max-width: 100%; /* Responsive */
  background: white; /* Chatbox background */
  border-radius: 8px; /* Rounded corners */
  overflow: hidden; /* Ensure content is contained */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Box shadow for chatbox */
`;

const App = () => {
  return (
    <Container className="container">
      <ChatBoxContainer>
        <ChatBot />
      </ChatBoxContainer>
    </Container>
  );
};

export default App;
