import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect, useRef } from "react";


const CreateRoomModal = (props) => {
  const createRoomError = props.createRoomError;
  const createRoomCallback = props.createRoomCallback;
  const newRoomId = useRef();
  const newAuth = useRef();
  const newSecret = useRef();
  const newUsername = useRef();
  const newMaxPlayers = useRef();


  const createRoom = () => {
    const dataToSend = {
        roomId: newRoomId.current.value,
        auth: newAuth.current.checked,
        secret: newSecret.current.value,
        username: newUsername.current.value,
        maxPlayers: Number(newMaxPlayers.current.value),
        minPlayers: undefined,
      };
      createRoomCallback(dataToSend);
  }  


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

export default CreateRoomModal;
