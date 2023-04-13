import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


import { useState, useRef } from "react";

const JoinRoomModal = (props) => {

  const joinRoomCallback = props.joinRoomCallback;
  const newSecret = useRef();
  const newUsername = useRef();
  const roomId = props.roomId;
  const auth = props.auth;
  const joinRoomError = props.joinRoomError;


  const joinRoom = async () => {
    console.log(newUsername.current.value);
    const dataToSend = {
      secret: auth ? newSecret.current.value : undefined,
      username: newUsername.current.value,
    };
    joinRoomCallback(dataToSend);
    console.log(dataToSend);
  };

  return (
    <Modal
      //   {...props}
      show={props.show}
      onHide={props.onHide}
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
        <input placeholder="Username" ref={newUsername}></input>
        {auth && <input placeholder="Room Secret" ref={newSecret}></input>}
      </Modal.Body>
      <p>{joinRoomError}</p>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={joinRoom}>Join</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JoinRoomModal;
