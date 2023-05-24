import { SERVER_URL } from "../../Enums/enums";
import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import SettingsIcon from "@mui/icons-material/Settings";
import animationData from "../../assets/75503-social-media-connection-video-with-a-mobile-on-hand.json";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import { Paper } from "@mui/material";
import Fab from "@mui/material/Fab";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

import { useNavigate } from "react-router-dom";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { BACKGROUNDS } from "../../Enums/enums";
import { Divider } from "@mui/material";

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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosee = () => {
    setAnchorEl(null);
  };

  return (
    <div className="home">
      <Box>
        <AppBar
          position="static"
          style={{ backgroundImage: BACKGROUNDS.AppBar }}
        >
          <Toolbar>
            <Grid
              justify="space-between" // Add it here :)
              container
              spacing={24}
            >
              <Grid item>
                <div>
                  <IconButton
                    onClick={handleClick}
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
              </Grid>
            </Grid>

            <IconButton
              // onClick={}
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
            >
              <SettingsIcon />
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
          An online Multiplayer-Games platform
        </Typography>
        {/* <Typography>Develop version</Typography> */}
        {/* <br /> */}
      </Paper>
      <Lottie
        loop={false}
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

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosee}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Name - Development Version
        </Typography>
        <Divider /> <Divider />
        <Divider />
        <Typography sx={{ p: 2 }}>
          A simple online multiplayer games platform. Create or join a room and
          start to play immediately.
        </Typography>
      </Popover>
    </div>
  );
};

export default Home;
