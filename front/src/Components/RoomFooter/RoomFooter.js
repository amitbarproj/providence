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
      <Button variant="contained" onClick={handleClickOpen}>
        Leave Room
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Leave Room"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure?
          </DialogContentText>
        </DialogContent>
          <DialogActions>
          <Grid container spacing={2}>

            <Grid xs={6}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            </Grid>
            <Grid xs={6}>
            <Button
              color="primary"
              variant="contained"
              onClick={leaveRoom}
              autoFocus
            >
              Leave
            </Button>
            </Grid>
           
           
        </Grid>
          </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomFooter;
