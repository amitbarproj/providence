import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Room from "./Components/Room/Room";
import CardRoom from "./Components/CardRoom/CardRoom";

const serverURL = ``;

function App() {
  const [inRoom, setInRoom] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");



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

  const joinRoom = async (roomId, username, secret) => {
    const dataToSend = {roomId: roomId , username: username , secret: secret}
    console.log(dataToSend);
    const response = await axios.post(`http://localhost:3002/joinRoom`, dataToSend);
    const data = response.data;
    console.log(data);

    if (data.success) {
      setRoomId(roomId);
      setUsername(username);
      setInRoom(true);
    } else {
      console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
    }
  };


 
  const renderList = allRooms.map((item, index) => (
    <CardRoom
      roomId={item.roomId}
      auth={item.roomId}
      numOfPlayers={item.numOfPlayers}
      maxPlayers={item.maxPlayers}
      joinRoomCallback={joinRoom}
    ></CardRoom>
  ));

  return (
    <div className="App">
      {!inRoom && renderList}
      {inRoom && <Room roomId={roomId} username={username}></Room>}
    </div>
  );
}

export default App;
