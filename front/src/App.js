import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Room from "./Components/Room/Room";
import Button from "react-bootstrap/Button";
import { AiOutlinePlus } from "react-icons/ai";

import CreateRoomModal from "./Components/CreateRoomModal/CreateRoomModal";
import CardsRoom from "./Components/CardsRoom/CardsRoom";

const serverURL = `http://10.0.0.8:3002`;

function App() {
  const [inRoom, setInRoom] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [createRoomError, setCreateRoomError] = useState("");

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

      {inRoom && <Room roomId={roomId} username={username}></Room>}
      <div className="d-grid gap-2">
        <button
          className="create-room-button"
          onClick={() => setModalShow(true)}
        >
          Create Room <AiOutlinePlus />
        </button>
      </div>
    </div>
  );
}

export default App;
