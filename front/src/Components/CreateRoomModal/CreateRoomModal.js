import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { BsFillLockFill } from "react-icons/bs";
import "./CreateRoomModal.css";

import Form from "react-bootstrap/Form";
import Collapse from "react-bootstrap/Collapse";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useState, useRef } from "react";
import GAMES from "../../Enums/enums";

const CreateRoomModal = (props) => {
  const createRoomError = props.createRoomError;
  const createRoomCallback = props.createRoomCallback;
  const newGame = useRef();
  const newRoomId = useRef();
  const newSecret = useRef();
  const newUsername = useRef();
  const newDescription = useRef();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [newMaxPlayers, setNewMaxPlayers] = useState(9);

  const createRoomm = () => {
    const dataToSend = {
      roomId: newRoomId.current.value,
      auth: open,
      secret: newSecret.current.value,
      username: newUsername.current.value,
      description: newDescription.current.value,
      game: newGame.current.value,
      maxPlayers: newMaxPlayers,
      minPlayers: undefined,
    };
    createRoomCallback(dataToSend);
    console.log(dataToSend);
  };

  const selectRender = Object.keys(GAMES).map((item) => {
    return <option value={item}>{item}</option>;
  });

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
            <Form.Select ref={newGame} aria-label="Default select example">
              <option value="" disabled selected>
                Select a Game
              </option>
              {selectRender}
            </Form.Select>
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
            <br /> <br />
            <Form.Switch
              label={open2 ? "" : "Add Description"}
              // reverse
              onChange={() => setOpen2(!open2)}
              checked={open2}
            />
            <Collapse in={open2}>
              <div id="example-collapse-text">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Description"
                  ref={newDescription}
                />
              </div>
            </Collapse>
            <br />
            <Form.Switch
              label={open ? <BsFillLockFill /> : "Add Room Password"}
              // reverse
              onChange={() => setOpen(!open)}
              checked={open}
            />
            <Collapse in={open}>
              <div id="example-collapse-text">
                <Form.Label>Room Password</Form.Label>
                <Form.Control
                  // required
                  type="password"
                  placeholder="Enter Password"
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

          <Collapse in={createRoomError !== ""}>
            <div className="CreateRoomErrorLabel">
              <br />
              <Form.Label>{createRoomError}</Form.Label>
            </div>
          </Collapse>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={createRoomm}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


export default CreateRoomModal;
