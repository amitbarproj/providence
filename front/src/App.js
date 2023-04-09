import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Room from "./Components/Room/Room";

// socket.on('connection_success', (d) => {
//   if(d === "DISCONNECT!") {
//     socket.disconnect();
//   }
//   else{
//     console.log(d);
//   }
// })

function App() {
  //NEED TO PUT THIS SOCKET IN NEW ROOM COMPONENT!!!!
  // const socket = io.connect("http://localhost:3002");

  // socket.on('connect' , () => {
  //   console.log(`Connection to SocketServer success`);
  //   socket.emit("join_room", {roomId: "111" , username: "amitbar101" } , (message) => {
  //     console.log(message);
  //   });
  // })

  // socket.on('recieve_message', (d) => {
  //   if(d === "connection_success") {
  //     socket.emit("join_room", {roomId: "111" , username: username });
  //   }
  //   else{
  //     console.log(d);
  //   }
  // })

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [inRoom, setInRoom] = useState(false);

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
    console.log(username);
  };

  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value);
    console.log(roomId);

  };

  const joinRoom = () => {
    setInRoom(true);
  };

  // const sendMessage = () => {
  //   socket.emit("join_room", {roomId: "111" , username: username });
  // }

  return (
    <div className="App">
      <input
        placeholder="username"
        type="username"
        value={username}
        onChange={handleUserNameChange}
      />
      <input
        placeholder="roomid"
        type="roomId"
        value={roomId}
        onChange={handleRoomIdChange}
      />


      <button onClick={() => joinRoom()}>Join Room</button>
      {inRoom && <Room
        
          roomId={roomId}
          username={username}
        
      ></Room>}
    </div>
  );
}

export default App;
