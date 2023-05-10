import * as React from "react";

import { Avatar, Badge } from "@mui/material";
import Box from "@mui/material/Box";

import Card from "@mui/material/Card";

import ClearIcon from "@mui/icons-material/Clear";
import { CardHeader } from "@mui/material";
import Typography from "@mui/material/Typography";
import { PROVIDENCE_GAME_STATE } from "../../Enums/enums";
import DoneIcon from "@mui/icons-material/Done";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";

const ProvidencePlayer = (props) => {
  const player = props.player;
  const playerGameData = props.player.gameData;
  const isConnected = props.player.isConnected;
  const username = props.player.username;
  // const isAdmin = props.player.isAdmin;
  const img = props.player.imgURL;
  const gameStarted = props.gameStarted;
  const winThisRound = player.gameData.winThisRound;
  const isMyTurn = playerGameData.myTurn;
  const points = playerGameData.points;
  const gameState = props.gameState;
  const isVoted = gameStarted ? props.player.gameData.currWord : undefined;
  const myWord = playerGameData.currWord;
  const allPlayersclock = props.clock;

  const winner =
    playerGameData.winner && gameState === PROVIDENCE_GAME_STATE.END_OF_GAME;

  return (
    <div>
      <Card
        raised={isMyTurn || winner ? true : false}
        sx={{
          height: "6.5rem",
          border: isMyTurn ? "#ff5722 dashed 2px" : "",
          backgroundColor: winner ? "yellow" : winThisRound ? "green" : "",
        }}
      >
        <CardHeader
          avatar={
            <Box mt={0} sx={{ flexDirection: "column" }}>
              <Badge
                anchorOrigin={{
                  vertical: "top",
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
                  <Typography variant="h6">
                      {points}
                    <Typography/>
                    {gameState === PROVIDENCE_GAME_STATE.CALCULATE_ROUND ? (
                      myWord ? (
                        myWord
                      ) : (
                        <ClearIcon />
                      )
                    ) : undefined}
                  </Typography>
                  <Typography>
                    {gameState === PROVIDENCE_GAME_STATE.ALL_CLOCK ? (
                      isVoted ? (
                        <DoneIcon color="success" />
                      ) : (
                        <LinearProgress />
                      )
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
