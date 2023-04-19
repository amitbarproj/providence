import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { GAMES, SOCKET_ENUMS } from "../../Enums/enums";
import { useParams, useNavigate } from "react-router-dom";
import { SERVER_URL, LOCAL_STORAGE } from "../../Enums/enums";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const Providence = (props) => {



    const socket  = props.socket;  
    if(socket) {
        console.log(`GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG`);
    } 

    useEffect(() => {
        socket.on(SOCKET_ENUMS.GAME_MSG, (game_msg) => {
            //SWITCH CASE GAME ENUMS...
            console.log(`GGGGGGGGGGGGGGGGGGGGGGGGGGG`);
            console.log(game_msg);
            console.log(`GGGGGGGGGGGGGGGGGGGGGGGGGGG`);

          }); 
      }, []);
 
  return (
        <h1>Providence Component</h1>
    )
  
};

export default Providence;
