import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Collapse from "react-bootstrap/Collapse";

import { useRef } from "react";

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
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Username"
              ref={newUsername}
            />
            {auth && (
              <>
                <br />
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter Password"
                  ref={newSecret}
                />
              </>
            )}
          </Form.Group>
          <Collapse in={joinRoomError !== ""}>
            <div className="CreateRoomErrorLabel">
              <br />
              <Form.Label>{joinRoomError}</Form.Label>
            </div>
          </Collapse>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
        <Button variant="primary" onClick={joinRoom}>Join</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JoinRoomModal;
