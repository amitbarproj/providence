import {  SERVER_URL } from "../../Enums/enums";
import {  useEffect, useRef } from "react";
import Lottie from "lottie-react";


import animationData from "../../assets/75503-social-media-connection-video-with-a-mobile-on-hand.json";





import { Paper } from "@mui/material";
import Fab from "@mui/material/Fab";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { BACKGROUNDS } from "../../Enums/enums";


const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {}, []);
  const walkRef = useRef();

  const StyledFab = styled(Fab)({
    position: "fixed",
    zIndex: 1,
    bottom: 30,
    right: 20,
    margin: "0 auto",
    backgroundImage: BACKGROUNDS.RoomsButton,
  });

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
        {/* <Typography>Develop version</Typography> */}
        {/* <br /> */}
      </Paper>
      <Lottie
        loop = {false}
        lottieRef={walkRef}
        animationData={animationData}
        style={{
          marginTop: "1rem",
          // height: "50vh",
          // width: "50vh",
          marginInline: "auto",
        }}
      />
      <StyledFab
        // disabled={players && players.length < gameConfig.minPlayers}
        onClick={() => {
          navigate(`/rooms`);
        }}
        variant="extended"
      >
        <SportsEsportsIcon sx={{ marginRight: 1 }} />
        Rooms
      </StyledFab>
      {/* <Lottie
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
      /> */}
    </div>
  );
};

export default Home;
