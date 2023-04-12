import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Collapse from "react-bootstrap/Collapse";
import Col from "react-bootstrap/Col";

import { useState, useRef } from "react";

const CreateRoomModal = (props) => {
  const createRoomError = props.createRoomError;
  const createRoomCallback = props.createRoomCallback;
  const newRoomId = useRef();
  const newSecret = useRef();
  const newUsername = useRef();
  const [open, setOpen] = useState(false);
  const [newMaxPlayers, setNewMaxPlayers] = useState(9);

  const createRoom = () => {
    const dataToSend = {
      roomId: newRoomId.current.value,
      auth: open,
      secret: newSecret.current.value,
      username: newUsername.current.value,
      maxPlayers: newMaxPlayers,
      minPlayers: undefined,
    };
    createRoomCallback(dataToSend);
    console.log(dataToSend);
  };

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
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Username"
            ref={newUsername}
          />
          <Form.Label>Room ID</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Room ID"
            ref={newRoomId}
          />
          <Form.Label>Maximum Players: {newMaxPlayers}</Form.Label>
          <Form.Range
            value={newMaxPlayers}
            onChange={(e) => {
              setNewMaxPlayers(Number(e.target.value));
            }}
            min={3}
            max={9}
          />
          <Form.Switch
            onClick={() => setOpen(!open)}
            //   aria-controls="example-collapse-text"
            //   aria-expanded={open}
            checked={open}
          />
          <Collapse in={open}>
            <div id="example-collapse-text">
              <Form.Label>Room Secret</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Secret"
                ref={newSecret}
              />
            </div>
          </Collapse>
        </Form.Group>
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
