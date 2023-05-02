import io from "socket.io-client";
import axios from "axios";
import * as React from "react";

import { useEffect, useState } from "react";
import { GAMES, SOCKET_ENUMS, SOCKET_GAME } from "../../Enums/enums";
import { useParams, useNavigate } from "react-router-dom";
import { SERVER_URL, LOCAL_STORAGE } from "../../Enums/enums";
import { Avatar, Badge } from "@mui/material";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardHeader } from "@mui/material";
import Typography from "@mui/material/Typography";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const ProvidencePlayer = (props) => {
  useEffect(() => {
    console.log(player);
  }, []);

  const player = props.player;
  const playerGameData = props.player.gameData;
  const isConnected = props.player.isConnected;
  const username = props.player.username;
  const isAdmin = props.player.isAdmin;
  const img = props.player.imgURL;
  const gameStarted = props.gameStarted;
  const sendGameMsgToServer = props.sendGameMsgToServer;

  // export type PROVIDENCE_PLAYER_DATA = {
  //   myTurn: boolean;
  //   points: number;
  // };

  const isMyTurn = playerGameData.myTurn;
  const points = playerGameData.points;

  const myUsername = props.myUsername;
  const isMe = props.isMe;

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
            <>
              <Typography variant="h6">{points}</Typography>
            </>
          }
        />

        {/* <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {points}
        </Typography>
      </CardContent> */}
        {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
        {gameStarted && (
          <Button onClick={() => sendGameMsgToServer("HELLO!")}>send!</Button>
        )}
      </Card>
    </div>
  );
};

export default ProvidencePlayer;
