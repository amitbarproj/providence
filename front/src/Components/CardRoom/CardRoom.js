import { useState, useEffect, useRef } from "react";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";
// import Card from "react-bootstrap/Card";
import Card from "react-bootstrap/Card";

// import Button from "react-bootstrap/Button";
// import { BsFillLockFill } from "react-icons/bs";
import HttpsIcon from "@mui/icons-material/Https";
import NoEncryptionGmailerrorredIcon from "@mui/icons-material/NoEncryptionGmailerrorred";

// import "./CardRoom.css";
import { LOCAL_STORAGE, SERVER_URL } from "../../Enums/enums";
import { useNavigate } from "react-router-dom";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const CardRoom = (props) => {
  const roomId = props.roomId;
  const auth = props.auth;
  const numOfPlayers = props.numOfPlayers;
  const gameType = props.gameType;
  const maxPlayers = props.maxPlayers;
  const gameStarted = props.gameStarted;
  const description = props.description;
  const setRoomId = props.setRoomId;
  const setUsername = props.setUsername;

  const newSecret = useRef();
  const newUsername = useRef();

  const [openDialog, setOpenDialog] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [joinRoomError, setJoinRoomError] = useState("");

  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const joinRoom = async () => {
    const dataToSend = {
      roomId: roomId,
      username: newUsername.current.value,
      secret: auth ? newSecret.current.value : undefined,
    };
    console.log(dataToSend);
    const response = await axios.post(`/api/joinRoom`, dataToSend);
    const data = response.data;
    console.log(data);

    if (data.success) {
      setRoomId(roomId);
      setUsername(dataToSend.username);
      localStorage.clear();
      const localStorageObj = {
        username: dataToSend.username,
        roomId: roomId,
      };
      localStorage.setItem(
        LOCAL_STORAGE.UserInfo,
        JSON.stringify(localStorageObj)
      );
      navigate(`/room/${roomId}`);
    } else {
      setJoinRoomError(data.description);
    }
  };

  return (
    <>




    
    <Card>
      <Card.Header>Room ID: {roomId}</Card.Header>
      <Card.Body>
        <Card.Title>{gameType}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Players: {numOfPlayers}/{maxPlayers}
        </Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        {auth ? <HttpsIcon /> : <NoEncryptionGmailerrorredIcon />}
      </Card.Body>
      <Button
        disabled={gameStarted || numOfPlayers >= maxPlayers}
        variant="contained"
        color={(gameStarted || numOfPlayers >= maxPlayers) ? "inherit" : "primary"}
        onClick={handleClickOpen}
      >
        {gameStarted
          ? "Game Started"
          : numOfPlayers >= maxPlayers
          ? "Full Room"
          : "Join Room"}
      </Button>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Join Room</DialogTitle>
        <DialogContent>
          <Divider />
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: ["100%"] },
            }}
            Validate
            autoComplete="off"
          >
            <FormControl sx={{ mt: 1 }}>
              <TextField
                // variant="standard"
                required
                label="Username"
                inputRef={newUsername}
              />
              {auth && (
                <>
                  <TextField
                    // variant="standard"
                    required
                    label="Room Password"
                    inputRef={newSecret}
                  />
                </>
              )}

              <Collapse in={joinRoomError !== ""} timeout="auto" unmountOnExit>
                <br />
                <FormLabel
                  sx={{
                    color: "#d32f2f",
                  }}
                >
                  {joinRoomError}
                </FormLabel>
              </Collapse>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={joinRoom}>
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </Card>





      {/* <Card sx={{ maxWidth: 345 }}>
      <CardHeader
       
        title={gameType}
        subheader="September 14, 2016"
      />
      <CardContent>
      
        <Typography gutterBottom variant="h5" component="div">
          {username}
          Players: {numOfPlayers}/{maxPlayers}

        </Typography>
      </CardContent>
      <CardActions>
      <Button
        disabled={gameStarted || numOfPlayers >= maxPlayers}
        variant="contained"
        color={(gameStarted || numOfPlayers >= maxPlayers) ? "inherit" : "primary"}
        onClick={handleClickOpen}
      >
        {gameStarted
          ? "Game Started"
          : numOfPlayers >= maxPlayers
          ? "Full Room"
          : "Join Room"}
      </Button>
      </CardActions>
    </Card> */}
    </>
    
  );
};

export default CardRoom;
