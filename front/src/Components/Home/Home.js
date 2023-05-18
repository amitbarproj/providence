import { LOCAL_STORAGE, SERVER_URL } from "../../Enums/enums";
import { useState, useEffect, useRef, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div className="home">
      <h1>HOME</h1>
      <Button
        onClick={() => {
          navigate(`/rooms`);
        }}
      >
        Go to rooms
      </Button>
    </div>
  );
};

export default Home;
