import io from "socket.io-client";
import axios from "axios";
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
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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
  const img = props.player.imgURL;
  const isMyTurn = false;

  return (
    <div>
      <Card raised={isMyTurn? true : false} sx={{}}>
        <CardHeader
          avatar={
            <Badge
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              // variant="dot"
              overlap="circular" badgeContent=" "
              color={isConnected ? "success" : "error"}
            >
              <Avatar
                src={`${img}`}
                sx={{ bgcolor: "#7295b8", width: 70, height: 70 }}
              ></Avatar>
            </Badge>
          }
          title={
            <Typography gutterBottom variant="h5" component="div">
              {username}
            </Typography>
          }
          subheader={
            <Typography gutterBottom variant="h5" component="div">
              {points}
            </Typography>
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
      </Card>
    </div>
  );
};

export default ProvidencePlayer;
