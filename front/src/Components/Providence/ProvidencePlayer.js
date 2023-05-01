import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState } from "react";
import { GAMES, SOCKET_ENUMS, SOCKET_GAME } from "../../Enums/enums";
import { useParams, useNavigate } from "react-router-dom";
import { SERVER_URL, LOCAL_STORAGE } from "../../Enums/enums";
import { Avatar, Badge } from "@mui/material";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardHeader } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


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

  return (
    <div>
      
      <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
            <Badge badgeContent="" color={ isConnected ? "success" : "error"}>
            <Avatar src={`${img}`} sx={{ bgcolor: "#7295b8" , width: 56, height: 56 }}>
                {/* <BsFillEmojiSmileFill></BsFillEmojiSmileFill> */}
            </Avatar>
          </Badge>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={username}
        subheader="September 14, 2016"
      />
      {/* <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      /> */}
      <CardContent>
      
        <Typography gutterBottom variant="h5" component="div">
          {username}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
    </div>
  );
};

export default ProvidencePlayer;
