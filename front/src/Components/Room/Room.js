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
    const response = await axios.get(`${serverURL}/startGame`);
    const data = response.data;
    if (data.success) {
      console.log(data.data);
    } else {
      console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
    }
  };




  return (
    <div className="Room">
      <h1>
        {props.username}, Welcome to room number {props.roomId}
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
