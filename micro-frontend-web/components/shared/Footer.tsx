import React from "react";
import ChatBot from "../chatbot/chatbot";

const Footer = () => {
  return (
    <>
      <ChatBot />
      <hr />

      <h5 className="footerText">
        Copyright @ 2022 HyShop. All rights reserved
      </h5>
    </>
  );
};

export default Footer;
