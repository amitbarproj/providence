import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState } from "react";
import { GAMES, SOCKET_ENUMS, SOCKET_GAME } from "../../Enums/enums";
import { useParams, useNavigate } from "react-router-dom";
import { SERVER_URL, LOCAL_STORAGE } from "../../Enums/enums";
import { Avatar, Badge } from "@mui/material";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const ProvidencePlayer = (props) => {
  useEffect(() => {
    console.log(player);
  }, []);

  const player = props.player;
  const isConnected = props.player.isConnected;
  const username = props.player.username;
  const points = props.player.points;
  const isAdmin = props.player.isAdmin;

  return (
    <div>
      <Badge badgeContent="" color={ isConnected ? "success" : "error"}>
        <Avatar sx={{ bgcolor: "#7295b8 " }}>{username}</Avatar>
      </Badge>
    </div>
  );
};

export default ProvidencePlayer;
