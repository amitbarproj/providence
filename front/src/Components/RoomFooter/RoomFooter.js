import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import "./RoomFooter.css";
import { useEffect, useRef, useState } from "react";

const RoomFooter = (props) => {
  const isAdmin = props.isAdmin;
  const gameStarted = props.gameStarted;
  const startGame = props.startGame;
  const leaveRoom = props.leaveRoom;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="footer">
      {isAdmin && !gameStarted && (
        <Button variant="contained" onClick={() => startGame()}>
          Strat Game
        </Button>
      )}
    </div>
  );
};

export default RoomFooter;
