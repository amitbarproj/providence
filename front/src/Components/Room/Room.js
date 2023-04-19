import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { SOCKET_ENUMS } from "../../Enums/enums";
import { useParams, useNavigate } from "react-router-dom";
import { SERVER_URL, LOCAL_STORAGE } from "../../Enums/enums";

const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const Room = (props) => {
  const [message, setMessage] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameType, setGameType] = useState(undefined);
  const [username, setUsername] = useState(undefined);

  const [renderRoom, SetRenderRoom] = useState(false);

  // const [userRoomInfo, setUserRoomInfo] = useState({isAdmin: false, playersUsername: [] , username: undefined  });

  const { id } = useParams();
  const navigate = useNavigate();

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
          localStorage.clear();
          navigate("/");
          console.log(data);
        }
      }
      if(localObj) {
        usernamee = localObj.username;
        checkIfUsernameExistInRoom();
      }
      else{
        navigate("/");
      }
    } else {
      setUsername(props.username);
      connectToRoom(props.username);
    }
  }, []);

  const connectToRoom = (usernamee) => {
    const socket = io.connect(serverURL);
    console.log(`444444444444444444444`);
    socket.on("connect", () => {
      console.log(`555555555555555555`);
      console.log(`Connection to SocketServer success`);
      console.log(username);
      socket.emit(
        "join_room",
        { roomId: id, username: usernamee },
        (message) => {
          if(message !== "ERROR") {
            console.log(`666666666666666`);
            console.log(message);
            const socketObj = JSON.parse(message);
          //   const joinRoomObj:SOCKET_JOIN_ROOM_OBJ = {
          //     players: currRoom.getPlayersSocketData(),
          //     youAdmin: currPlayer.isAdmin(),
          //     gameType: currRoom.getGameType()
          // }
            console.log(socketObj);
            if (socketObj.youAdmin) {
              setIsAdmin(true);
            }
            console.log(socketObj.players);
            setPlayers(socketObj.players);
            setGameType(socketObj.gameType)
            SetRenderRoom(true);

            socket.on("NEW_PLAYER_JOIN", (msg) => {
              const newPlayers = msg;
              console.log(newPlayers);
              setPlayers(newPlayers.players);
            });
            socket.on(SOCKET_ENUMS.NEW_PLAYER_LEAVE, (msg) => {
              const newPlayers = msg;
              setPlayers(newPlayers.players);
            });
            socket.on(SOCKET_ENUMS.YOU_ARE_NEW_ADMIN, (msg) => {
              setIsAdmin(true);
            });
            socket.on(SOCKET_ENUMS.ADMIN_DISMISS_YOU, (msg) => {
              console.log(msg);
              localStorage.clear();
              navigate("/");
            });
            socket.on(SOCKET_ENUMS.START_GAME, (msg) => {
              console.log(msg);
            });
            socket.on(SOCKET_ENUMS.GAME_MSG, (msg) => {
              setMessage(msg);
            }); //NEED TO BE IN SPECIFIG GAME LOGIC
          }
          else{
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
      username: username 
    });
    const data = response.data;
    if (data.success) {
      localStorage.clear();
      navigate("/")
      console.log(data);
    } else {
      console.log(data);
    }
  };

  const renderPlayers =   players.map((item, index) => <h3>{item.username}</h3>)
  console.log(players);
  return (
    renderRoom && (
      <div className="Room">
        <h1>
          {username}, Welcome to room number {id}
        </h1>
        <p>{message}</p>
        {renderPlayers}
        {isAdmin && (
          <Button variant="primary" onClick={() => startGame()}>
            Strat Game
          </Button>
          
        )}
         <Button variant="primary" onClick={() => leaveRoom()}>
            Leave Room
          </Button>
      </div>
    )
  );
};

export default Room;
