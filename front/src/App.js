import "./App.css";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Room from "./Components/Room/Room";
import CardRoom from "./Components/CardRoom/CardRoom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import Modal from "react-bootstrap/Modal";

const serverURL = `http://10.0.0.8:3002`;

function App() {
  const [inRoom, setInRoom] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [createRoomError, setCreateRoomError] = useState("");

  //

  const newRoomId = useRef();
  const newAuth = useRef();
  const newSecret = useRef();
  const newUsername = useRef();
  const newMaxPlayers = useRef();

  useEffect(() => {
    getAllRooms();
  }, []);

  const createRoom = async () => {

    const dataToSend = {
      roomId: newRoomId.current.value,
      auth: newAuth.current.checked,
      secret: newSecret.current.value,
      username: newUsername.current.value,
      maxPlayers: Number(newMaxPlayers.current.value),
      minPlayers: undefined,
    };

    console.log(dataToSend);
    const response = await axios.post(`${serverURL}/createRoom`, dataToSend);
    const data = response.data;
    console.log(data);

    if (data.success) {
      setModalShow(false);
      setRoomId(dataToSend.roomId);
      setUsername(dataToSend.username);
      setInRoom(true);
    } else {
      setCreateRoomError(data.description);
      console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
    }
  };

  const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Room
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Please Enter:</h4>
          <input placeholder="Room ID" ref={newRoomId}></input>
          <input placeholder="Username" ref={newUsername}></input>
          <input placeholder="Room Secret" ref={newSecret}></input>
          Max PLayers:
          <Form.Range ref={newMaxPlayers} min={3} max={9} />
          <Form.Switch ref={newAuth} />
        </Modal.Body>
        <p>{createRoomError}</p>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button onClick={createRoom}>Create</Button>
        </Modal.Footer>
      </Modal>
    );
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



  const renderList = allRooms.map((item, index) => (
    <CardRoom
      roomId={item.roomId}
      auth={item.auth}
      numOfPlayers={item.numOfPlayers}
      maxPlayers={item.maxPlayers}
      setRoomId={setRoomId}
      setUsername={setUsername}
      setInRoom={setInRoom}
    ></CardRoom>
  ));

  return (
    <div className="App">
      {renderList}

      <>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Create Room
        </Button>
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </>

      {inRoom && <Room roomId={roomId} username={username}></Room>}
    </div>
  );
}

export default App;
