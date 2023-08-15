import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import AppNavbar from "./Navbar";
import Chat from "./Chat";
import React from "react";
import Ads from "./Ads";

const Home = () => {
  return (
    <>
      <AppNavbar />
      <Ads />
      <Chat />
    </>
  );
};

export default Home;
