import { useEffect, useState } from "react";
import { SOCKET_GAME } from "../../Enums/enums";
import ProvidencePlayers from "./ProvidencePlayers";
import GameHeader from "./GameHeader";
import { PROVIDENCE_GAME_STATE } from "../../Enums/enums";
import { Divider } from "@mui/material";
import Fab from "@mui/material/Fab";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as React from "react";
import Button from "@mui/material/Button";

const Providence = (props) => {
  const socket = props.socket;
  const players = props.players;
  const setPlayers = props.setPlayers;
  const myUsername = props.username;
  const roomId = props.roomId;
  const gameStarted = props.gameStarted;
  const gameConfig = props.gameConfig;
  const isAdmin = props.isAdmin;

  const [currWord, setCurrWord] = useState(undefined);
  const [clock, setClock] = useState(undefined);
  const [currPlayerClock, setCurrPlayerClock] = useState(undefined);
  const [gameState, setGameState] = useState(undefined);
  const [gameStats, setGameStats] = useState([]);

  useEffect(() => {
    if (gameStarted) {
      sendGameMsgToServer("GET_GAME_INFO", "");
    }
    socket.on(SOCKET_GAME.NEW_PLAYER_TURN, (game_msg) => {
      const newPlayers = game_msg;
      setPlayers(newPlayers.players);
    });
    socket.on(SOCKET_GAME.UPDATE_PLAYERS, (game_msg) => {
      const newPlayers = game_msg;
      console.log(game_msg);
      setPlayers(newPlayers.players);

      if (newPlayers.stats) {
        setGameStats(newPlayers.stats);
      }
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

  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

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
          setGameStats(gameInfo.stats || []);
        }
      }
    );
  };

  const StyledFab = styled(Fab)({
    position: "fixed",
    zIndex: 1,
    bottom: 20,
    right: 20,
    margin: "0 auto",
    backgroundImage: `linear-gradient(to bottom right, #72FFB6, #10D164)`,
  });
  return (
    <>
      <GameHeader
        currWord={currWord}
        gameState={gameState}
        clock={clock}
        gameConfig={gameConfig}
      ></GameHeader>
      <Divider />
      <ProvidencePlayers
        myUsername={myUsername}
        players={players}
        sendGameMsgToServer={sendGameMsgToServer}
        gameStarted={gameStarted}
        currPlayerClock={currPlayerClock}
        gameConfig={gameConfig}
        clock={clock}
        gameState={gameState}
      ></ProvidencePlayers>
      {isAdmin && gameState === PROVIDENCE_GAME_STATE.END_OF_GAME && (
        <StyledFab
          onClick={() => {
            sendGameMsgToServer("START_NEW_GAME", "");
          }}
          variant="extended"
        >
          <PlayArrowIcon />
          New Game
        </StyledFab>
      )}
      {/* {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {ldfgd}
          </SwipeableDrawer>
        </React.Fragment>
      ))} */}
    </>
  );
};

export default Providence;
