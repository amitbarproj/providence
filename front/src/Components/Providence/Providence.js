import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { GAMES, SOCKET_ENUMS, SOCKET_GAME } from "../../Enums/enums";
import { useParams, useNavigate } from "react-router-dom";
import { SERVER_URL, LOCAL_STORAGE } from "../../Enums/enums";
import ProvidencePlayer from "./ProvidencePlayer";
import ProvidencePlayers from "./ProvidencePlayers";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const Providence = (props) => {
  const socket = props.socket;
  const players = props.players;
  const [msg, setMsg] = useState(undefined);
  // const [players, setPlayers] = useState(props.players);

  useEffect(() => {
    socket.on(SOCKET_GAME.BLA, (game_msg) => {
      setMsg(game_msg);
    });
  }, []);

  useEffect(() => {
    console.log(players);
  }, [players]);

  return <ProvidencePlayers players={players}></ProvidencePlayers>;;
};

export default Providence;
