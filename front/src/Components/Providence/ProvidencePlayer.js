
import * as React from "react";

import { Avatar, Badge } from "@mui/material";

import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

import { CardHeader } from "@mui/material";
import Typography from "@mui/material/Typography";
import { PROVIDENCE_GAME_STATE } from "../../Enums/enums";

// const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

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

  return (
    <div>
      <Card
        raised={isMyTurn ? true : false}
        sx={{
          border: isMyTurn ? "#ff5722 dashed 2px" : "",
          backgroundColor: winThisRound ? "green" : isVoted ? "red" : "",
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
          <Collapse in={gameState === PROVIDENCE_GAME_STATE.CALCULATE_ROUND} timeout="auto" unmountOnExit>
          <Divider />
          <TextField
            id="outlined-sdfdfd"
            label={myWord}
            variant="standard"
          />
    
        </Collapse>
      </Card>
    </div>
  );
};

export default ProvidencePlayer;
