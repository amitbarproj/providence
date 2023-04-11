import {  useState, useRef } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsFillLockFill } from 'react-icons/bs';


const CardRoom = (props) => {
  const roomId = props.roomId;
  const auth = props.auth;
  const numOfPlayers = props.numOfPlayers;
  const maxPlayers = props.maxPlayers;
  const joinRoomCallback = props.joinRoomCallback;

  const [modalShow, setModalShow] = useState(false);
  
  const username = useRef();
  const secret = useRef();



  const joinRoom = () => {
    setModalShow(false);
    const secretToSend = auth? secret.current.value : undefined
    joinRoomCallback(roomId, username.current.value, secretToSend);
  };

  const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Join Room {roomId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Please Enter:</h4>
          <input placeholder="Username" ref={username}></input>
          {auth && <input placeholder="Room Secret" ref={secret}></input>  }
        </Modal.Body>
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
        <Card.Text>
          please join the game bla bla bla bla bla
        </Card.Text>
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
