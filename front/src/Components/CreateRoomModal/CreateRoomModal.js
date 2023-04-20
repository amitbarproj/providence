import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { BsFillLockFill } from "react-icons/bs";
import "./CreateRoomModal.css";
import Form from "react-bootstrap/Form";
import Collapse from "react-bootstrap/Collapse";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useState, useRef } from "react";
import { GAMES } from "../../Enums/enums";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const CreateRoomModal = (props) => {
  const createRoomError = props.createRoomError;
  const createRoomCallback = props.createRoomCallback;
  const [newGame, setNewGame] = useState("");
  const newRoomId = useRef();
  const newSecret = useRef();
  const newUsername = useRef();
  const newDescription = useRef();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [newMaxPlayers, setNewMaxPlayers] = useState(9);

  const createRoomm = () => {
    console.log(newGame);

    const dataToSend = {
      roomId: newRoomId.current.value,
      auth: open,
      secret: newSecret.current.value,
      username: newUsername.current.value,
      description: open2 ? newDescription.current.value : "",
      game: newGame,
      maxPlayers: newMaxPlayers,
      minPlayers: undefined,
    };
    createRoomCallback(dataToSend);
    console.log(dataToSend);
  };

  const selectRender = Object.keys(GAMES).map((item) => {
    return `${item}`;
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
      {/* <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >

    </Box> */}
      <Modal.Body>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <TextField
              id="outlined-sdfdfd"
              label="Room ID"
              variant="outlined"
              required
              inputRef={newRoomId}
            />
            <br /> <br />
            {/* <Form.Select ref={newGame} aria-label="Default select example">
              <option value="" disabled selected>
                Select a Game
              </option>
              {selectRender}
            </Form.Select> */}
            <Autocomplete
              onChange={(event, value) => setNewGame(value)}
              id="disabled-options-demo"
              options={selectRender}
              getOptionDisabled={(option) => option !== GAMES.Providence}
              required
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select a Game" />
              )}
            />
            <br />
            <Form.Label>Maximum Players: {newMaxPlayers}</Form.Label>
            <Slider
              aria-label=""
              // defaultValue={9}
              // getAriaValueText={valuetext}
              value={newMaxPlayers}
              onChange={(e) => {
                setNewMaxPlayers(Number(e.target.value));
              }}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={3}
              max={9}
            />
            <br />
            <FormControlLabel
              control={
                <Switch checked={open2} onChange={() => setOpen2(!open2)} />
              }
              label={open2 ? "" : "Add Description"}
              labelPlacement="end"
            />
            <Collapse in={open2}>
              <div id="example-collapse-text">
                <TextField
                  id="outlined-sdfdfd"
                  label="Description"
                  variant="outlined"
                  inputRef={newDescription}
                />
              </div>
            </Collapse>
            <br />
            <FormControlLabel
              control={
                <Switch checked={open} onChange={() => setOpen(!open)} />
              }
              label={open ? <BsFillLockFill /> : "Add Password"}
              labelPlacement="end"
            />
            <Collapse in={open}>
              <div id="example-collapse-text">
                <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  inputRef={newSecret}
                />
              </div>
            </Collapse>
            <br />
            {/* <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Username"
              ref={newUsername}
            /> */}
            <TextField
                  // id="outlined-password-input"
                  label="Username"
                  // autoComplete="current-password"
                  inputRef={newUsername}
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
