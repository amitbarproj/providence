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
  const [currPlayerClock, setCurrPlayerClock] = useState("");
  const [gameState, setGameState] = useState(undefined);

  // const [isVoted, setIsVoted] = useState(false);



  useEffect(() => {
    sendGameMsgToServer("GET_GAME_INFO" , "");
    socket.on(SOCKET_GAME.NEW_PLAYER_TURN, (game_msg) => {
      const newPlayers = game_msg;
      setPlayers(newPlayers.players);
    });
    socket.on(SOCKET_GAME.UPDATE_PLAYERS, (game_msg) => {
      const newPlayers = game_msg;
      setPlayers(newPlayers.players);
    });
    socket.on(SOCKET_GAME.UPDATE_ALL_CLOCK, (game_msg) => {
      const newTime = game_msg.counter;
      setClock(newTime);
      // const socketPlayers = game_msg.players;
      // if(socketPlayers.get(myUsername).getGameData().currWord){
      //   setIsVoted(true);
      // }
    });
    socket.on(SOCKET_GAME.UPDATE_PLAYER_CLOCK, (game_msg) => {
      const newTime = game_msg;
      setCurrPlayerClock(newTime);
    });

    socket.on(SOCKET_GAME.UPDATE_GAME_STATE, (game_msg) => {
      const newState = game_msg;
      setGameState(newState);
    });
  }, []);

  useEffect(() => {
    console.log(players);
  }, [players]);

  const sendGameMsgToServer = (type , msg) => {
    socket.emit(
      "game_msg",
      { roomId: roomId, username: myUsername, data: {type: type ,content: msg} },
      (message) => {
        if(type === "GET_GAME_INFO") {
            setGameState(JSON.parse(message).gameState);
        }
      }
    );
  }
  return (
    <>
          <h1>Game State: {gameState}</h1>

      <h1>Time: {clock}</h1>
      <ProvidencePlayers
        myUsername={myUsername}
        players={players}
        sendGameMsgToServer={sendGameMsgToServer}
        gameStarted={gameStarted}
        currPlayerClock={currPlayerClock}
        clock={clock}
        gameState={gameState}
        // isVoted={isVoted}
      ></ProvidencePlayers>
    </>
  );
};

export default Providence;
