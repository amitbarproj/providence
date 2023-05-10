import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
import { SOCKET_GAME } from "../../Enums/enums";
import ProvidencePlayers from "./ProvidencePlayers";
import GameHeader from "./GameHeader";
import { PROVIDENCE_GAME_STATE } from "../../Enums/enums";

const Providence = (props) => {
  const socket = props.socket;
  const players = props.players;
  const setPlayers = props.setPlayers;
  const myUsername = props.username;
  const roomId = props.roomId;
  const gameStarted = props.gameStarted;
  const gameInfo = props.gameInfo;
  const [currWord, setCurrWord] = useState(undefined);
  const [clock, setClock] = useState(undefined);
  const [currPlayerClock, setCurrPlayerClock] = useState(undefined);
  const [gameState, setGameState] = useState(undefined);

  useEffect(() => {
    sendGameMsgToServer("GET_GAME_INFO", "");
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
    });
    socket.on(SOCKET_GAME.UPDATE_PLAYER_CLOCK, (game_msg) => {
      const newTime = game_msg;
      setCurrPlayerClock(newTime);
    });
    socket.on(SOCKET_GAME.UPDATE_GAME_STATE, (game_msg) => {
      const newState = game_msg.newState;
      switch (newState) {
        case PROVIDENCE_GAME_STATE.PLAYER_CLOCK:
          break;
        case PROVIDENCE_GAME_STATE.ALL_CLOCK:
          setCurrWord(game_msg.data.currWord);
          break;
        case PROVIDENCE_GAME_STATE.CALCULATE_ROUND:
          break;
        case PROVIDENCE_GAME_STATE.END_OF_GAME:
          break;
      }
      setGameState(newState);
    });
  }, []);

  const sendGameMsgToServer = (type, msg) => {
    socket.emit(
      "game_msg",
      {
        roomId: roomId,
        username: myUsername,
        data: { type: type, content: msg },
      },
      (message) => {
        if (type === "GET_GAME_INFO") {
          const gameInfo = JSON.parse(message).gameState;

          setGameState(gameInfo.gameState);
          setCurrWord(gameInfo.currWord);

        }
      }
    );
  };
  return (
    <>
      <GameHeader currWord={currWord} gameState={gameState} clock={clock}></GameHeader>
      <ProvidencePlayers
        myUsername={myUsername}
        players={players}
        sendGameMsgToServer={sendGameMsgToServer}
        gameStarted={gameStarted}
        currPlayerClock={currPlayerClock}
        clock={clock}
        gameState={gameState}
      ></ProvidencePlayers>
    </>
  );
};

export default Providence;
