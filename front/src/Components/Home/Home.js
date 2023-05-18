import { LOCAL_STORAGE, SERVER_URL } from "../../Enums/enums";
import { useState, useEffect, useRef, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { Divider } from "@mui/material";
import { BACKGROUNDS, PLAYERS_BACKGROUND_COLOR } from "../../Enums/enums";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {}, []);

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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Multiplayer
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Home;
