import React from "react";
import ChatBot from "react-simple-chatbot";
import { Segment, Button } from "semantic-ui-react";
//import './Chat.css';

export default function Chat() {
  const steps = [
    {
      id: "Greet",
      message: "Hi, Welcome!!!!!",
      trigger: "Ask Name",
    },
    {
      id: "Ask Name",
      message: "Please enter your name",
      trigger: "waiting1",
    },
    {
      id: "waiting1",
      user: true,
      trigger: "Name",
    },
    {
      id: "Name",
      message: "Hi {previousValue}, please select your query!",
      trigger: "query",
    },
    {
      id: "query",
      options: [
        { value: "prices", label: "Prices", trigger: "pricesResponse" },
        { value: "exchange", label: "Exchange", trigger: "exchangeResponse" },
        { value: "quality", label: "Quality", trigger: "qualityResponse" },
        {
          value: "shipping",
          label: "Shipping Time",
          trigger: "shippingResponse",
        },
      ],
    },
    {
      id: "pricesResponse",
      message:
        "The prices of all products are fixed. However, we can provide you free Home Delivery service.",
      end: true,
    },
    {
      id: "exchangeResponse",
      message:
        "The product can be exchanged if found damaged, but returns are not acceptable.",
      end: true,
    },
    {
      id: "qualityResponse",
      message:
        "The quality is top notch and checked by our industrial professionals.",
      end: true,
    },
    {
      id: "shippingResponse",
      message: "The standard shipping time is 4-5 working days.",
      end: true,
    },
  ];

  return (
    <div>
      <Segment className="chatbot-window">
        <ChatBot recognitionEnable={true} steps={steps} floating />
      </Segment>
    </div>
  );
}
