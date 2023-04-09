import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Room from "./Components/Room/Room";
import CardRoom from "./Components/CardRoom/CardRoom";

const serverURL = ``;

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [allRooms, setAllRooms] = useState([]);

  useEffect(() => {
    getAllRooms();
  }, []);

  const getAllRooms = async () => {
    const response = await axios.get(`http://localhost:3002/getAllRooms`);
    const data = response.data;
    if (data.success) {
      setAllRooms(data.data);
    } else {
      console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
    }
  };

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

  const renderList = allRooms.map((item, index) => (
    <CardRoom
      roomId={item.roomId}
      auth={item.roomId}
      numOfPlayers={item.numOfPlayers}
      maxPlayers={item.maxPlayers}
    ></CardRoom>
  ));

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
      {renderList}

      <button onClick={() => joinRoom()}>Join Room</button>
      {inRoom && <Room roomId={roomId} username={username}></Room>}
    </div>
  );
}

export default App;
