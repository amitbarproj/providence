import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Room from "./Components/Room/Room";
import Button from "react-bootstrap/Button";
import { AiOutlinePlus } from "react-icons/ai";

import CreateRoomModal from "./Components/CreateRoomModal/CreateRoomModal";
import CardsRoom from "./Components/CardsRoom/CardsRoom";
import { SERVER_URL } from "./Enums/enums";
const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;



function App() {
  const [inRoom, setInRoom] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [createRoomError, setCreateRoomError] = useState("");

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [gameType, setGameType] = useState("");

  useEffect(() => {
    getAllRooms();
  }, []);

  const createRoom = async (modalObj) => {
    console.log(modalObj);
    const response = await axios.post(`${serverURL}/createRoom`, modalObj);
    const data = response.data;
    console.log(data);

    if (data.success) {
      setModalShow(false);
      setRoomId(modalObj.roomId);
      setUsername(modalObj.username);
      setGameType(modalObj.game);
      setInRoom(true);
    } else {
      setCreateRoomError(data.description);
      console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
    }
  };

  const getAllRooms = async () => {
    const response = await axios.get(`${serverURL}/getAllRooms`);
    const data = response.data;
    if (data.success) {
      setAllRooms(data.data);
      console.log(data.data);
    } else {
      console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
    }
  };

  return (
    <div className="App">
      {!inRoom && (
        <div>
          <CardsRoom
            allRooms={allRooms}
            setRoomId={setRoomId}
            setUsername={setUsername}
            setInRoom={setInRoom}
          ></CardsRoom>
          <br></br>
          <br></br>
          <CreateRoomModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            createRoomError={createRoomError}
            createRoomCallback={createRoom}
          />
          <div className="d-grid gap-2">
            <button
              className="create-room-button"
              onClick={() => setModalShow(true)}
            >
              Create Room <AiOutlinePlus />
            </button>
          </div>
        </div>
      )}
      {inRoom && (
        <Room roomId={roomId} username={username} game={gameType}></Room>
      )}
    </div>
  );
}

export default App;
