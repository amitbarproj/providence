import io from "socket.io-client";
import axios from "axios";

import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

const serverURL = `http://10.0.0.8:3002`;


const Room = (props) => {
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState({});


  useEffect(() => {
    const socket = io.connect(serverURL);
    socket.on("connect", () => {
      console.log(`Connection to SocketServer success`);
      socket.emit("join_room", props, (message) => {
        //NEED TO CHECK IF THIS SUCCESS MESSAGE, if not need to disconnect ?
        console.log(JSON.parse(message));
        setUserInfo(JSON.parse(message));
        socket.on("recieve_message", (d) => {
          //TODO IF REACIEVE MESSAGE IS YOU ARE NEW ADMIN NEED TO SET ADIMN!!!!
          //TODO SWITCH CASE ALL SOCKET MESSAGES!!!!!!!!!
          //TODO ne wplayer join room,,,
          switch(d) {
            case SOCKET_ENUMS.YOU_ARE_NEW_ADMIN:
            setUserInfo({admin: true});
            break;
          }
          console.log(d);
          setMessage(d);
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




  return (
    <div className="Room">
      <h1>
        {props.username}, Welcome to room {props.roomId}
      </h1>
      <h1>
        We are playing {props.game}
      </h1>
      <p>
        {message}
      </p>
      {userInfo.admin && 
          <Button variant="primary" onClick={() => startGame()}>
            Strat Game
        </Button>
      }
      
    </div>
  );
};

export default Room;
const SOCKET_ENUMS = {
  YOU_ARE_NEW_ADMIN: "YOU_ARE_NEW_ADMIN",

}
