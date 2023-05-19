import io from "socket.io-client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { GAMES, SOCKET_ENUMS } from "../../Enums/enums";
import { useParams, useNavigate } from "react-router-dom";
import { SERVER_URL, LOCAL_STORAGE } from "../../Enums/enums";
import Providence from "../Providence/Providence";
import RoomHeader from "../RoomHeader/RoomHeader";
import Fab from "@mui/material/Fab";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./Room.css";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const Room = (props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameType, setGameType] = useState(undefined);
  const [gameInfo, setGameInfo] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [gameStarted, setGameStarted] = useState(false);
  const [renderRoom, SetRenderRoom] = useState(false);
  const [socket, setSocket] = useState(undefined);
  const [gameConfig, setGameConfig] = useState(undefined);

  const { id } = useParams();
  const navigate = useNavigate();

  const renderSwitch = () => {
    switch (gameType) {
      case GAMES.Providence:
        return (
          <Providence
            gameStarted={gameStarted}
            roomId={id}
            username={username}
            players={players}
            setPlayers={setPlayers}
            socket={socket}
            gameConfig={gameConfig}
            isAdmin={isAdmin}
          ></Providence>
        );
      default:
        return <h1>NON GAME</h1>;
    }
  };

  useEffect(() => {
    console.log(props.username);
    if (!props || (props && props.username === "")) {
      const localObj = JSON.parse(localStorage.getItem(LOCAL_STORAGE.UserInfo));
      let usernamee = undefined;
      console.log(`1111111111111111`);
      async function checkIfUsernameExistInRoom() {
        const response = await axios.post(
          `${serverURL}/api/checkIfUsernameExistInRoom`,
          {
            username: usernamee,
            roomId: id,
          }
        );
        const data = response.data;
        console.log(data);
        if (data.success) {
          console.log(`22222222222222222`);
          setUsername(data.data.username);
          // SetRenderRoom(true);
          connectToRoom(usernamee);
        } else {
          //localStorage.clear();
          navigate("/rooms");
          console.log(data);
        }
      }
      if (localObj) {
        usernamee = localObj.username;
        checkIfUsernameExistInRoom();
      } else {
        navigate("/rooms");
      }
    } else {
      setUsername(props.username);
      connectToRoom(props.username);
    }
  }, []);

  const connectToRoom = (usernamee) => {
    const socket = io.connect(serverURL);
    setSocket(socket);
    console.log(`444444444444444444444`);
    socket.on("connect", () => {
      console.log(`555555555555555555`);
      console.log(`Connection to SocketServer success`);
      console.log(username);
      socket.emit(
        "join_room",
        { roomId: id, username: usernamee },
        (message) => {
          if (message !== SOCKET_ENUMS.ERROR) {
            console.log(`666666666666666`);
            console.log(message);
            const socketObj = JSON.parse(message);
            console.log(socketObj);
            if (socketObj.youAdmin) {
              setIsAdmin(true);
            }
            setPlayers(socketObj.players);
            setGameType(socketObj.gameType);
            setGameInfo(socketObj.gameInfo);
            setGameConfig(socketObj.gameConfig);
            setGameStarted(socketObj.gameStarted);
            SetRenderRoom(true);
            socket.on(SOCKET_ENUMS.UPDATE_PLAYERS_STATE, (msg) => {
              const newPlayers = msg;
              setPlayers(newPlayers.players);
            });

            socket.on(SOCKET_ENUMS.YOU_ARE_NEW_ADMIN, (msg) => {
              setIsAdmin(true);
            });
            socket.on(SOCKET_ENUMS.ADMIN_DISMISS_YOU, (msg) => {
              localStorage.clear();
              navigate("/rooms");
            });
            socket.on(SOCKET_ENUMS.START_GAME, (msg) => {
              setGameStarted(true);
            });
          } else {
            localStorage.clear();
            navigate("/rooms");
          }
        }
      );
    });
    return () => {
      socket.disconnect();
    };
  };

  const startGame = async () => {
    const response = await axios.post(`${serverURL}/api/startGame`, {
      roomId: id,
    });
    const data = response.data;
    if (data.success) {
      console.log(data);
    } else {
      console.log(data);
    }
  };

  const leaveRoom = async () => {
    console.log(id);
    const response = await axios.post(`${serverURL}/api/leaveRoom`, {
      roomId: id,
      username: username,
    });
    const data = response.data;
    if (data.success) {
      localStorage.clear();
      navigate("/rooms");
      console.log(data);
    } else {
      console.log(data);
    }
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
      {renderRoom && (
        <div className="Room">
          <RoomHeader
            gameInfo={gameInfo}
            gameType={gameType}
            roomId={id}
            leaveRoom={leaveRoom}
          ></RoomHeader>
          <h1>{socket ? renderSwitch() : "GAME NOT STARTED"}</h1>
          {isAdmin && !gameStarted && (
            <StyledFab
              disabled={players && players.length < gameConfig.minPlayers}
              onClick={() => {
                startGame();
              }}
              variant="extended"
            >
              <PlayArrowIcon />
              Start
            </StyledFab>
          )}
        </div>
      )}
      {!renderRoom && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!renderRoom}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Room;
