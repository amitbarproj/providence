import { useState, useRef } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsFillLockFill } from "react-icons/bs";
const serverURL = `http://10.0.0.8:3002`;


const CardRoom = (props) => {
  const roomId = props.roomId;
  const auth = props.auth;
  const numOfPlayers = props.numOfPlayers;
  const maxPlayers = props.maxPlayers;
  const setRoomId = props.setRoomId;
  const setUsername = props.setUsername;
  const setInRoom = props.setInRoom;

  const [modalShow, setModalShow] = useState(false);
  const [joinRoomError, setJoinRoomError] = useState("");

  const username = useRef();
  const secret = useRef();

  // const joinRoom = () => {
  //   // setModalShow(false);
  //   const secretToSend = auth? secret.current.value : undefined
  //   joinRoomCallback(roomId, username.current.value, secretToSend, setModalShow);
  // };

  const joinRoom = async () => {
    const secretToSend = auth ? secret.current.value : undefined;
    const dataToSend = { roomId: roomId, username: username.current.value, secret: secretToSend };
    console.log(dataToSend);
    const response = await axios.post(`${serverURL}/joinRoom`, dataToSend);
    const data = response.data;
    console.log(data);

    if (data.success) {
      setModalShow(false);
      setRoomId(roomId);
      setUsername(username.current.value);
      setInRoom(true);
    } else {
      setJoinRoomError(data.description);
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
            Join Room {roomId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Please Enter:</h4>
          <input placeholder="Username" ref={username}></input>
          {auth && <input placeholder="Room Secret" ref={secret}></input>}
        </Modal.Body>
        <p>{joinRoomError}</p>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button onClick={joinRoom}>Join</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Room ID: {roomId}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Players: {numOfPlayers}/{maxPlayers}
        </Card.Subtitle>
        <Card.Text>please join the game bla bla bla bla bla</Card.Text>
        {auth && <BsFillLockFill />}
      </Card.Body>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Join Room
      </Button>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Card>
  );
};

export default CardRoom;
