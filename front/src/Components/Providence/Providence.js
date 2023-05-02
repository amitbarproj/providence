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
  const setPlayers = props.setPlayers;
  const myUsername = props.username;
  const roomId = props.roomId;
  const gameStarted = props.gameStarted;
  const [msg, setMsg] = useState(undefined);
  const [clock, setClock] = useState("");

  useEffect(() => {
    socket.on(SOCKET_GAME.NEW_PLAYER_TURN, (game_msg) => {
      const newPlayers = game_msg;
      setPlayers(newPlayers.players);
    });
    socket.on(SOCKET_GAME.UPDATE_CLOCK, (game_msg) => {
      const newTime = game_msg;
      console.log(newTime);
      setClock(newTime);
    });
  }, []);

  useEffect(() => {
    console.log(players);
  }, [players]);

  const sendGameMsgToServer = (msg) => {
    socket.emit(
      "game_msg",
      { roomId: roomId, username: myUsername, data: msg },
      (message) => {
        
      }
    );
  }
  return (
    <>
      <h1>{clock}</h1>
      <ProvidencePlayers
        myUsername={myUsername}
        players={players}
        sendGameMsgToServer={sendGameMsgToServer}
        gameStarted={gameStarted}
      ></ProvidencePlayers>
    </>
  );
};

export default Providence;
