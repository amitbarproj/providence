import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { BACKGROUNDS, PLAYERS_BACKGROUND_COLOR } from "../../Enums/enums";

const RoomsHeader = (props) => {
  const navigate = useNavigate();

  const handleClickOpen = props.handleClickOpen;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundImage: BACKGROUNDS.AppBar }} >
        <Toolbar>
          <IconButton
            onClick={() => {
              navigate("/");
            }}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 0 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rooms
          </Typography>
          <IconButton
            onClick={handleClickOpen}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 0 }}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default RoomsHeader;
