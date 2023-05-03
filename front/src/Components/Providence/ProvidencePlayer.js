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
import { SERVER_URL } from "../../Enums/enums";
import { Avatar, Badge } from "@mui/material";

import Card from "@mui/material/Card";

import { CardHeader } from "@mui/material";
import Typography from "@mui/material/Typography";

// const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const ProvidencePlayer = (props) => {
  const player = props.player;
  const playerGameData = props.player.gameData;
  const isConnected = props.player.isConnected;
  const username = props.player.username;
  const isAdmin = props.player.isAdmin;
  const img = props.player.imgURL;
  const gameStarted = props.gameStarted;
  const winThisRound = player.gameData.winThisRound;
  const isMyTurn = playerGameData.myTurn;
  const points = playerGameData.points;

  return (
    <div>
      <Card
        raised={isMyTurn ? true : false}
        sx={{
          border: isMyTurn ? "#ff5722 dashed 2px" : "",
          backgroundColor: winThisRound ? "green" : "",
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
      </Card>
    </div>
  );
};

export default ProvidencePlayer;
