import io from "socket.io-client";
import axios from "axios";
import * as React from "react";

import { useEffect, useState, useRef } from "react";
import {
  GAMES,
  PROVIDENCE_SOCKET_GAME,
  SOCKET_ENUMS,
  SOCKET_GAME,
} from "../../Enums/enums";
import { useParams, useNavigate } from "react-router-dom";
import { SERVER_URL, LOCAL_STORAGE } from "../../Enums/enums";
import { Avatar, Badge } from "@mui/material";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import TextField from "@mui/material/TextField";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardHeader } from "@mui/material";
import Typography from "@mui/material/Typography";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const ProvidencePlayer = (props) => {
  const [open, setOpen] = useState(false);

  const mainWord = useRef();
  const yourWord = useRef();

  const player = props.player;
  const playerGameData = props.player.gameData;
  const isConnected = props.player.isConnected;
  const username = props.player.username;
  const isAdmin = props.player.isAdmin;
  const img = props.player.imgURL;
  const gameStarted = props.gameStarted;
  const sendGameMsgToServer = props.sendGameMsgToServer;
  const currPlayerClock = props.currPlayerClock;
  const clock = props.clock;

  const isMyTurn = playerGameData.myTurn;

  useEffect(() => {
    console.log(isMyTurn);
    if (isMyTurn && isMe) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isMyTurn]);

  useEffect(() => {
    console.log(currPlayerClock);
    if (currPlayerClock === 0 && isMyTurn && isMe) {
      setOpen(false);
    }
  }, [currPlayerClock]);

  useEffect(() => {
    console.log();
    if (clock === 2) {
      sendYourWordToServer();
    }
  }, [clock]);

  const points = playerGameData.points;

  const myUsername = props.myUsername;
  const isMe = props.isMe;

  const sendMainWordToServer = () => {
    setOpen(false);
    const mainWordToSend = mainWord.current ? mainWord.current.value : "";
    sendGameMsgToServer(PROVIDENCE_SOCKET_GAME.SEND_MAIN_WORD, mainWordToSend);
  };

  const sendYourWordToServer = () => {
    const yourWordToSend = yourWord.current
      ? yourWord.current.value
      : "TEST@@@@";
    sendGameMsgToServer(
      PROVIDENCE_SOCKET_GAME.SEND_PLAYER_WORD,
      yourWordToSend
    );
  };

  return (
    <div>
      <Card
        raised={isMyTurn ? true : false}
        sx={{
          border: isMyTurn ? "#ff5722 dashed 2px" : "",
          backgroundColor: isMe ? "#90caf9" : "",
        }}
      >
        <CardHeader
          avatar={
            <Badge
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              overlap="circular"
              badgeContent=" "
              color={isConnected ? "success" : "error"}
            >
              <Avatar
                src={`${img}`}
                sx={{ bgcolor: "", width: 70, height: 70 }}
              ></Avatar>
            </Badge>
          }
          title={<Typography>{username}</Typography>}
          subheader={
            gameStarted && (
              <>
                <Typography variant="h6">{points}</Typography>
              </>
            )
          }
        />

        {/* {gameStarted && isMe && (
          <Button
            onClick={() =>
              sendGameMsgToServer(
                PROVIDENCE_SOCKET_GAME.SEND_PLAYER_WORD,
                "HELLO!"
              )
            }
          >
            send!
          </Button>
        )} */}
      </Card>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Enter a word"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {currPlayerClock}
          </DialogContentText>
          <TextField
            id="outlined-sdfdfd"
            label="Word"
            variant="standard"
            required
            inputRef={mainWord}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={sendMainWordToServer}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProvidencePlayer;
