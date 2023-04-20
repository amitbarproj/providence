import io from "socket.io-client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import { GAMES, SOCKET_ENUMS } from "../../Enums/enums";
import { useParams, useNavigate } from "react-router-dom";
import { SERVER_URL, LOCAL_STORAGE } from "../../Enums/enums";
import Providence from "../Providence/Providence";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const Room = (props) => {
  const [message, setMessage] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameType, setGameType] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [gameStarted, setGameStarted] = useState(false);
  const [renderRoom, SetRenderRoom] = useState(false);
  const [socket, setSocket] = useState(undefined);

  // let socket;

  // const [userRoomInfo, setUserRoomInfo] = useState({isAdmin: false, playersUsername: [] , username: undefined  });

  const { id } = useParams();
  const navigate = useNavigate();

  const renderSwitch = () => {
    switch (gameType) {
      case GAMES.Providence:
        console.log(socket);
        return <Providence players={players} socket={socket}></Providence>;
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
          `${serverURL}/checkIfUsernameExistInRoom`,
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
          navigate("/");
          console.log(data);
        }
      }
      if (localObj) {
        usernamee = localObj.username;
        checkIfUsernameExistInRoom();
      } else {
        navigate("/");
      }
    } else {
      setUsername(props.username);
      connectToRoom(props.username);
    }
  }, []);

  const connectToRoom = (usernamee) => {
    //const socket = io.connect(serverURL);
    const socket = io.connect(serverURL);
    setSocket(socket)
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
            setGameStarted(socketObj.gameStarted);
            SetRenderRoom(true);
            // socket.on(SOCKET_ENUMS.NEW_PLAYER_JOIN, (msg) => {
            //   const newPlayers = msg;
            //   setPlayers(newPlayers.players);
            // });
            socket.on(SOCKET_ENUMS.UPDATE_PLAYERS_STATE, (msg) => {
              const newPlayers = msg;
              setPlayers(newPlayers.players);
            });

            socket.on(SOCKET_ENUMS.YOU_ARE_NEW_ADMIN, (msg) => {
              setIsAdmin(true);
            });
            socket.on(SOCKET_ENUMS.ADMIN_DISMISS_YOU, (msg) => {
              localStorage.clear();
              navigate("/");
            });
            socket.on(SOCKET_ENUMS.START_GAME, (msg) => {
              setGameStarted(true);
            });
          
          } else {
            localStorage.clear();
            navigate("/");
          }
        }
      );
    });
    return () => {
      socket.disconnect();
    };
  };

  const startGame = async () => {
    console.log(id);
    const response = await axios.post(`${serverURL}/startGame`, {
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
    const response = await axios.post(`${serverURL}/leaveRoom`, {
      roomId: id,
      username: username,
    });
    const data = response.data;
    if (data.success) {
      localStorage.clear();
      navigate("/");
      console.log(data);
    } else {
      console.log(data);
    }
  };

  const renderPlayers = players.map((item, index) => <h3>{item.username}</h3>);
  console.log(players);
  return (
    renderRoom && (
      <div className="Room">
        <h1>
          {username}, Welcome to room number {id}
        </h1>
        <p>{message}</p>
        {renderPlayers}
        {isAdmin && !gameStarted &&  (
          <Button variant="primary" onClick={() => startGame()}>
            Strat Game
          </Button>
        )}
        <Button variant="primary" onClick={() => leaveRoom()}>
          Leave Room
        </Button>
        <h1>{gameStarted && socket ? renderSwitch() : "GAME NOT STARTED"}</h1>
      </div>
    )
  );
};

export default Room;
