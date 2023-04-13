import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Collapse from "react-bootstrap/Collapse";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useState, useRef } from "react";

const CreateRoomModal = (props) => {
  const createRoomError = props.createRoomError;
  const createRoomCallback = props.createRoomCallback;
  const newRoomId = useRef();
  const newSecret = useRef();
  const newUsername = useRef();
  const [open, setOpen] = useState(false);
  const [newMaxPlayers, setNewMaxPlayers] = useState(9);

  const createRoomm = () => {
    const dataToSend = {
      roomId: newRoomId.current.value,
      auth: open,
      secret: newSecret.current.value,
      username: newUsername.current.value,
      maxPlayers: newMaxPlayers,
      minPlayers: undefined,
    };
    createRoomCallback(dataToSend);
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
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
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Room ID</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Room ID"
              ref={newRoomId}
            />
            <br />
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
              label= {open? "" : "Add Room Secret"}
              // reverse
              onChange={() => setOpen(!open)}
              checked={open}
            />
            <Collapse in={open}>
              <div id="example-collapse-text">
                <Form.Label>Room Secret</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Enter Secret"
                  ref={newSecret}
                />
              </div>
            </Collapse>
            <br />

            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Username"
              ref={newUsername}
            />
          </Form.Group>
        </Row>
      </Modal.Body>
      <p>{createRoomError}</p>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={createRoomm}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateRoomModal;
