import * as React from "react";

import { useEffect, useState, useRef } from "react";
import {
  PROVIDENCE_GAME_STATE,
  PROVIDENCE_SOCKET_GAME,
} from "../../Enums/enums";
import { Avatar, Badge } from "@mui/material";
import TextField from "@mui/material/TextField";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import AlarmIcon from "@mui/icons-material/Alarm";
import SendIcon from "@mui/icons-material/Send";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import CircularProgress from "@mui/material/CircularProgress";
import AlarmIcon from "@mui/icons-material/Alarm";
import Fab from "@mui/material/Fab";

// const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const MyProviPlayer = (props) => {
  const [openCurrPlayerWordDialog, setOpenCurrPlayerWordDialog] =
    useState(false);
  const [openInputWord, setOpenInputWord] = useState(false);

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
  const allPlayersclock = props.clock;
  const winThisRound = player.gameData.winThisRound;
  const gameState = props.gameState;
  const isVoted = gameStarted ? props.player.gameData.currWord : undefined;
  const isMyTurn = playerGameData.myTurn;
  const myWord = playerGameData.currWord;
  const winner =
    playerGameData.winner && gameState === PROVIDENCE_GAME_STATE.END_OF_GAME;

  useEffect(() => {
    console.log(isMyTurn);
    if (gameState !== PROVIDENCE_GAME_STATE.ALL_CLOCK) {
      setOpenInputWord(false);
    }
    if (gameState !== PROVIDENCE_GAME_STATE.PLAYER_CLOCK) {
      setOpenCurrPlayerWordDialog(false);
    }
    if (gameState === PROVIDENCE_GAME_STATE.PLAYER_CLOCK) {
      if (isMyTurn) {
        setOpenCurrPlayerWordDialog(true);
      } else {
        setOpenCurrPlayerWordDialog(false);
      }
    } else if (gameState === PROVIDENCE_GAME_STATE.ALL_CLOCK) {
      if (!isVoted) {
        setOpenInputWord(true);
      } else {
        setOpenInputWord(false);
      }
    }
  }, [gameState, isMyTurn]);

  const points = playerGameData.points;

  const sendMainWordToServer = (skip) => {
    setOpenCurrPlayerWordDialog(false);
    const mainWordToSend = skip
      ? undefined
      : mainWord.current
      ? mainWord.current.value
        ? mainWord.current.value
        : undefined
      : undefined;
    sendGameMsgToServer(PROVIDENCE_SOCKET_GAME.SEND_MAIN_WORD, mainWordToSend);
  };

  const sendYourWordToServer = () => {
    const yourWordToSend = yourWord.current
      ? yourWord.current.value
        ? yourWord.current.value
        : undefined
      : undefined;
    sendGameMsgToServer(
      PROVIDENCE_SOCKET_GAME.SEND_PLAYER_WORD,
      yourWordToSend
    );
    setOpenInputWord(false);
  };

  return (
    <div>
      <Card
        raised={isMyTurn || winner ? true : false}
        sx={{
          border: isMyTurn ? "#ff5722 dashed 2px" : "",
          backgroundColor: winner
            ? "yellow"
            : winThisRound
            ? "green"
            : "#90caf9",
        }}
      >
        {!openInputWord && (
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
                  <Typography variant="h6">
                    {gameState === PROVIDENCE_GAME_STATE.CALCULATE_ROUND ? (
                      myWord ? (
                        myWord
                      ) : (
                        <ClearIcon />
                      )
                    ) : (
                      points
                    )}
                    {gameState === PROVIDENCE_GAME_STATE.ALL_CLOCK ? (
                      isVoted ? (
                        <DoneIcon />
                      ) : (
                        <CircularProgress size="1.5rem" color="inherit" />
                      )
                    ) : undefined}
                  </Typography>
                </>
              )
            }
          />
        )}

        {openInputWord && (
          <CardHeader
            subheader={
              <>
                <TextField
                  label="Enter word"
                  size="small"
                  inputRef={yourWord}
                />
                <Divider />
                <Fab
                  color="primary"
                  size="small"
                  onClick={() => sendYourWordToServer()}
                >
                  <SendIcon />
                </Fab>
              </>
            }
          />
        )}
      </Card>
      <Dialog
        open={openCurrPlayerWordDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Enter a word"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <h4 style={{ color: "black" }}>
              <AlarmIcon color="primary" /> {currPlayerClock}
            </h4>
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
            endIcon={<SkipNextIcon />}
            color="primary"
            variant="outlined"
            onClick={() => sendMainWordToServer(true)}
          >
            Skip
          </Button>
          <Button
            endIcon={<SendIcon />}
            color="primary"
            variant="contained"
            onClick={() => sendMainWordToServer(false)}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyProviPlayer;
