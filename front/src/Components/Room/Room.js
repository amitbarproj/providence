import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { SOCKET_ENUMS } from "../../Enums/enums"

const serverURL = `http://10.0.0.8:3002`;


const Room = (props) => {
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [playersUsername, setPlayersUsername] = useState([]);



  useEffect(() => {
    const socket = io.connect(serverURL);
    socket.on("connect", () => {
      console.log(`Connection to SocketServer success`);
      socket.emit("join_room", props, (message) => {  
        console.log(`00000000000000000000000000`);
        //NEED TO CHECK IF THIS SUCCESS MESSAGE, if not need to disconnect ?
        const socketObj = JSON.parse(message);
        console.log(socketObj);
        if(socketObj.youAdmin){
          setIsAdmin(true);
        }
        setPlayersUsername(socketObj.playersUsername);
        socket.on("recieve_message", (msg) => {
          //TODO IF REACIEVE MESSAGE IS YOU ARE NEW ADMIN NEED TO SET ADIMN!!!!
          //TODO SWITCH CASE ALL SOCKET MESSAGES!!!!!!!!!
          //TODO ne wplayer join room,,,
          switch(msg) {
            case "YOU_ARE_NEW_ADMIN":
              setIsAdmin(true);
            break;

            case 'NEW PLAYER JOIN TABLE':
              console.log(`New player join...`);
              break;
          }
          console.log(msg);
          setMessage(msg);
        });
        socket.on("NEW_PLAYER_JOIN", (msg) => {
          const newPlayers = msg;
          setPlayersUsername(newPlayers.playersUsername);
        });
        socket.on("NEW_PLAYER_LEAVE", (msg) => {
          const newPlayers = msg;
          setPlayersUsername(newPlayers.playersUsername);
        });
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);


  const startGame = async () => {
    console.log(props.roomId);
    const response = await axios.post(`${serverURL}/startGame` , {
      roomId: props.roomId
  });
    const data = response.data;
    if (data.success) {
      console.log(data);
    } else {
      console.log(data);
    }
  };


  const renderPlayers = playersUsername.map((item, index) => (
    <h3>{item}</h3>
  ));



  return (
    <div className="Room">
      <h1>
        {props.username}, Welcome to room number {props.roomId}
      </h1>
      <p>
        {message}
      </p>
      {renderPlayers}
      {isAdmin && 
          <Button variant="primary" onClick={() => startGame()}>
            Strat Game
        </Button>
      }
      
    </div>
  );
};

export default Room;
// const SOCKET_ENUMS = {
//   YOU_ARE_NEW_ADMIN: "YOU_ARE_NEW_ADMIN",

// }
