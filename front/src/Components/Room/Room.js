// socket.on('connection_success', (d) => {
//   if(d === "DISCONNECT!") {
//     socket.disconnect();
//   }
//   else{
//     console.log(d);
//   }
// })
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

  //NEED TO PUT THIS SOCKET IN NEW ROOM COMPONENT!!!!
  // const socket = io.connect("http://localhost:3002");

  // socket.on('connect' , () => {
  //   console.log(`Connection to SocketServer success`);
  //   socket.emit("join_room", {roomId: "111" , username: "amitbar101" } , (message) => {
  //     console.log(message);
  //   });
  // })

  //   const [username, setUsername] = useState("");
  //   const [roomId, setRoomId] = useState("");
  //   const [inRoom, setInRoom] = useState(false);

  //   const handleUserNameChange = (event) => {
  //     setUsername(event.target.value);
  //   };

  //   const handleRoomIdChange = (event) => {
  //     setRoomId(event.target.value);
  //   };

  //   const joinRoom = () => {
  //     setInRoom(true);
  //   };

  // const sendMessage = () => {
  //   socket.emit("join_room", {roomId: "111" , username: username });
  // }

  return <div className="Room">BLAAAAAAAAAAAAAA</div>;
};

export default Room;
