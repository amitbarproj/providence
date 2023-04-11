import io from "socket.io-client";

import { useEffect, useState } from "react";

const serverURL = `http://10.0.0.8:3002`;


const Room = (props) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = io.connect(serverURL);
    socket.on("connect", () => {
      console.log(`Connection to SocketServer success`);
      socket.emit("join_room", props, (message) => {
        //NEED TO CHECK IF THIS SUCCESS MESSAGE, if not need to disconnect ?
        console.log(message);
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

  return (
    <div className="Room">
      <h1>
        {props.username}, Welcome to room number {props.roomId}
      </h1>
      <p>
        {message}
      </p>
    </div>
  );
};

export default Room;
