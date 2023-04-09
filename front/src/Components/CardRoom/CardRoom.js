import { useEffect, useState, useRef } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const CardRoom = (props) => {
  const roomId = props.roomId;
  const auth = props.roomId;
  const numOfPlayers = props.numOfPlayers;
  const maxPlayers = props.maxPlayers;
  const joinRoomCallback = props.joinRoomCallback;

  const [modalShow, setModalShow] = useState(false);
  
  const username = useRef();
  const secret = useRef();



  const joinRoom = () => {
    setModalShow(false);
    console.log(username.current.value);
    console.log(secret.current.value);
    joinRoomCallback(roomId, username.current.value, secret.current.value);
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
          <input placeholder="Room Secret" ref={secret}></input>  
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
        <Card.Title>{roomId}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {numOfPlayers}/{maxPlayers}
        </Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Card.Link href="#">Another Link</Card.Link>
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
