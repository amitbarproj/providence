
import io from "socket.io-client";

import { useEffect } from "react";

const Room = (props) => {
  useEffect(() => {
    const socket = io.connect("http://localhost:3002");
    socket.on("connect", () => {
      console.log(`Connection to SocketServer success`);
      socket.emit(
        "join_room",
        props,
        (message) => {
            //NEED TO CHECK IF THIS SUCCESS MESSAGE, if not need to disconnect ?
          console.log(message);
          socket.on("recieve_message", (d) => {
            console.log(d);
          });
        }
      );
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return <div className="Room">{props.username}, Welcome to room number {props.roomId}</div>;
};

export default Room;
