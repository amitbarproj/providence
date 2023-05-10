import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useRef, useState } from "react";
import Popover from "@mui/material/Popover";

const RoomHeader = (props) => {
  const leaveRoom = props.leaveRoom;
  const roomId = props.roomId;
  const gameInfo = props.gameInfo;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosee = () => {
    setAnchorEl(null);
  };

  const [openLeaveRoomDialog, setOpenLeaveRoomDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenLeaveRoomDialog(true);
  };

  const handleClose = () => {
    setOpenLeaveRoomDialog(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={handleClick}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <InfoIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Room {roomId}
            </Typography>
            <Button onClick={handleClickOpen} color="inherit">
              Leave
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Dialog
        open={openLeaveRoomDialog}
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
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={leaveRoom}
            autoFocus
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>

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
        <Typography sx={{ p: 2 }}>{gameInfo}</Typography>
      </Popover>
    </>
  );
};

export default RoomHeader;

// export default function ButtonAppBar() {
//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static">
//         <Toolbar>
//           <IconButton
//             size="large"
//             edge="start"
//             color="inherit"
//             aria-label="menu"
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             News
//           </Typography>
//           <Button color="inherit">Login</Button>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }
