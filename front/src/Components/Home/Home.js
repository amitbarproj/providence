import { LOCAL_STORAGE, SERVER_URL } from "../../Enums/enums";
import { useState, useEffect, useRef, forwardRef } from "react";
import Lottie from "lottie-react";
// import animationData from "../../assets/45082-game-controller.json";
// import animationData from "../../assets/120694-planet-earth-world-preloader-jumping-animation.json";
import animationData from "../../assets/137560-sea-walk.json";
import animationDataPlay from "../../assets/98342-play.json";

import { Paper } from "@mui/material";

import { useNavigate } from "react-router-dom";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { Divider } from "@mui/material";
import { BACKGROUNDS, PLAYERS_BACKGROUND_COLOR } from "../../Enums/enums";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {}, []);
  const joystickRef = useRef();
  const walkRef = useRef();
  const playRef = useRef();

  return (
    <div className="home">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          style={{ backgroundImage: BACKGROUNDS.AppBar }}
        >
          <Toolbar>
            <IconButton
              onClick={() => {
                navigate(`/rooms`);
              }}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <SportsEsportsIcon />
            </IconButton>
            {/* <Lottie
              loop={false}
              lottieRef={joystickRef}
              animationData={animationData}
              style={{
                height: "3rem",
                width: "3rem",
              }}
            /> */}
            {/* <Typography variant="h6" component="div" sx={{ flexGrow: 0.75 }}>
              Multiplayer
            </Typography> */}
          </Toolbar>
        </AppBar>
      </Box>
      <Paper
        sx={{
          backgroundColor: BACKGROUNDS.GameHeader,
        }}
      >
        <Typography variant="h4" fontWeight={600} sx={{ paddingTop: "1.5rem" }}>
          Name
        </Typography>
        <Typography variant="h6" sx={{ paddingBottom: "1rem" }}>
          An online Multiplayer-Game platform
        </Typography>
        <Typography>Develop version</Typography>
        <br />
      </Paper>
      <Lottie
        loop
        lottieRef={walkRef}
        animationData={animationData}
        style={{
          // marginTop: "5rem",
          height: "50vh",
          width: "50vh",
          marginInline: "auto",
        }}
      />
      <Lottie
        loop
        lottieRef={playRef}
        onClick={() => {
          navigate(`/rooms`);
        }}
        animationData={animationDataPlay}
        style={{
          position: "fixed",
          zIndex: 1,
          bottom: -30,
          right: 0,
          margin: "0",
          height: "10rem",
          width: "10rem",
        }}
      />
    </div>
  );
};

export default Home;
