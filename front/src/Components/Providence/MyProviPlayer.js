import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState, useRef } from "react";
import {
  PLAYERS_BACKGROUND_COLOR,
  PROVIDENCE_GAME_STATE,
  PROVIDENCE_SOCKET_GAME,
} from "../../Enums/enums";
import { Avatar, Badge } from "@mui/material";
import TextField from "@mui/material/TextField";

import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SendIcon from "@mui/icons-material/Send";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import AlarmIcon from "@mui/icons-material/Alarm";
import Fab from "@mui/material/Fab";
import LinearProgress from "@mui/material/LinearProgress";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const MyProviPlayer = (props) => {
  const [openCurrPlayerWordDialog, setOpenCurrPlayerWordDialog] =
    useState(false);
  const [openInputWord, setOpenInputWord] = useState(false);
  const [yourWord, setYourWord] = useState(undefined);
  const [mainWord, setMainWord] = useState(undefined);

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
  const gameConfig = props.gameConfig;
  const maxPoints = gameConfig.maxPoints;
  const winner =
    playerGameData.winner && gameState === PROVIDENCE_GAME_STATE.END_OF_GAME;
  const phoneRef = useRef();

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
        setMainWord(undefined);
        setOpenCurrPlayerWordDialog(true);
      } else {
        setOpenCurrPlayerWordDialog(false);
      }
    } else if (gameState === PROVIDENCE_GAME_STATE.ALL_CLOCK) {
      if (!isVoted) {
        setYourWord(undefined);
        setOpenInputWord(true);
      } else {
        setOpenInputWord(false);
      }
    }
  }, [gameState, isMyTurn]);

  const points = playerGameData.points;

  const sendMainWordToServer = (skip) => {
    setOpenCurrPlayerWordDialog(false);
    const toServer = skip ? undefined : mainWord;
    sendGameMsgToServer(PROVIDENCE_SOCKET_GAME.SEND_MAIN_WORD, toServer);
  };

  const sendYourWordToServer = () => {
    sendGameMsgToServer(PROVIDENCE_SOCKET_GAME.SEND_PLAYER_WORD, yourWord);
    setOpenInputWord(false);
  };

  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 12,
      },
      body1: {
        fontWeight: 500,
        fontSize: 20,
      },
    },
  });

  return (
    <div>
      <Card
        raised={isMyTurn || winner || openInputWord ? true : false}
        sx={{
          height: "6.5rem",
          border: openInputWord
            ? "#ff6e6e solid 4px"
            : isMyTurn && gameState !== PROVIDENCE_GAME_STATE.END_OF_GAME
            ? "#ff5722 dashed 2px"
            : "",
          backgroundImage: winner
            ? PLAYERS_BACKGROUND_COLOR.Winner
            : winThisRound && gameState !== PROVIDENCE_GAME_STATE.END_OF_GAME
            ? PLAYERS_BACKGROUND_COLOR.WinRound
            : PLAYERS_BACKGROUND_COLOR.Me,
        }}
      >
        {!openInputWord && (
          <CardHeader
            avatar={
              <Box mt={0} sx={{ flexDirection: "column" }}>
                <Badge
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  overlap="circular"
                  badgeContent={username}
                  color={isConnected ? "success" : "error"}
                >
                  <Avatar
                    src={img}
                    sx={{ bgcolor: "", width: "4.5rem", height: "4.5rem" }}
                  ></Avatar>
                </Badge>
              </Box>
            }
            subheader={
              <Box mt={0} sx={{ flexDirection: "column" }}>
                {gameStarted && (
                  <>
                    {/* <Typography variant="h6">
                      <span>{points}</span>/{maxPoints}
                    </Typography> */}
                    <ThemeProvider theme={theme}>
                      <Typography style={{ display: "inline-block" }}>
                        {points}
                      </Typography>
                      <Typography
                        style={{ display: "inline-block" }}
                        variant="subtitle1"
                      >
                        /{maxPoints}
                      </Typography>
                    </ThemeProvider>
                    <Typography variant="h6" fontWeight={600}>
                      {gameState === PROVIDENCE_GAME_STATE.CALCULATE_ROUND ? (
                        myWord ? (
                          myWord
                        ) : (
                          <ClearIcon color="error" />
                        )
                      ) : gameState === PROVIDENCE_GAME_STATE.ALL_CLOCK ? (
                        isVoted ? (
                          <DoneIcon color="success" />
                        ) : (
                          <LinearProgress sx={{ marginTop: 1 }} />
                        )
                      ) : gameState === PROVIDENCE_GAME_STATE.END_OF_GAME ? (
                        winner ? (
                          <EmojiEventsIcon />
                        ) : undefined
                      ) : undefined}
                    </Typography>
                  </>
                )}
              </Box>
            }
          />
        )}

        {openInputWord && (
          <CardHeader
            subheader={
              <>
                <Input
                  value={yourWord}
                  onChange={(e) => setYourWord(e.target.value)}
                  placeholder="Enter Word"
                  size="small"
                />

                <Fab
                  disabled={!yourWord}
                  color="primary"
                  onClick={() => sendYourWordToServer()}
                  size="medium"
                  variant="extended"
                  sx={{ marginBottom: -0.85, marginTop: 1 }}
                >
                  <SendIcon sx={{ mr: 1 }} />
                  Send
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
              <AlarmIcon color="primary" />{" "}
              {currPlayerClock >= 0 ? currPlayerClock : 0}
            </h4>
          </DialogContentText>
          <TextField
            id="outlined-sdfdfd"
            label="Word"
            variant="standard"
            required
            value={mainWord}
            onChange={(e) => setMainWord(e.target.value)}
            // inputRef={mainWord}
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
            disabled={!mainWord}
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
