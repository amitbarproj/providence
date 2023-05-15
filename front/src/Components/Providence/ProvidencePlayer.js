import * as React from "react";

import { Avatar, Badge } from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

import ClearIcon from "@mui/icons-material/Clear";
import { CardHeader } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  PLAYERS_BACKGROUND_COLOR,
  PROVIDENCE_GAME_STATE,
} from "../../Enums/enums";
import DoneIcon from "@mui/icons-material/Done";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const ProvidencePlayer = (props) => {
  const player = props.player;
  const playerGameData = props.player.gameData;
  const isConnected = props.player.isConnected;
  const username = props.player.username;
  // const isAdmin = props.player.isAdmin;
  const gameConfig = props.gameConfig;
  const img = props.player.imgURL;
  const gameStarted = props.gameStarted;
  const winThisRound = player.gameData.winThisRound;
  const isMyTurn = playerGameData.myTurn;
  const points = playerGameData.points;
  const gameState = props.gameState;
  const isVoted = gameStarted ? props.player.gameData.currWord : undefined;
  const myWord = playerGameData.currWord;
  // const allPlayersclock = props.clock;
  const currPlayerClock = props.currPlayerClock;
  const currPlayerClockSec = gameConfig.currPlayerClockSec;
  const maxPoints = gameConfig.maxPoints;

  const [allPlayersClockVal, setAllPlayersClockVal] = useState(0);

  const winner =
    playerGameData.winner && gameState === PROVIDENCE_GAME_STATE.END_OF_GAME;

  useEffect(() => {
    setAllPlayersClockVal((currPlayerClock * 100) / currPlayerClockSec);

    return () => {};
  }, [currPlayerClock]);


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
        raised={isMyTurn || winner ? true : false}
        sx={{
          height: "6.5rem",
          border:
            isMyTurn && gameState !== PROVIDENCE_GAME_STATE.END_OF_GAME
              ? "#ff5722 dashed 2px"
              : "",
          backgroundImage: winner
            ? PLAYERS_BACKGROUND_COLOR.Winner
            : winThisRound && gameState !== PROVIDENCE_GAME_STATE.END_OF_GAME
            ? PLAYERS_BACKGROUND_COLOR.WinRound
            : PLAYERS_BACKGROUND_COLOR.Regular,
        }}
      >
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
            <Box sx={{ flexDirection: "column" }}>
              {gameStarted && (
                <>
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
                  </ThemeProvider>{" "}
                  <Typography>
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
                    ) : gameState === PROVIDENCE_GAME_STATE.PLAYER_CLOCK ? (
                      isMyTurn ? (
                        <CircularProgress
                          variant="determinate"
                          size={30}
                          value={allPlayersClockVal}
                        />
                      ) : undefined
                    ) : undefined}
                  </Typography>
                </>
              )}
            </Box>
          }
        />
      </Card>
    </div>
  );
};

export default ProvidencePlayer;
