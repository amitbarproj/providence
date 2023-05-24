import { LOCAL_STORAGE, SERVER_URL } from "../../Enums/enums";
import axios from "axios";
import { useState, useEffect, useRef, forwardRef } from "react";
import { styled } from "@mui/material/styles";
import Fab from "@mui/material/Fab";
import * as React from "react";

import CardsRoom from "../CardsRoom/CardsRoom";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { FormControlLabel } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import NoEncryptionGmailerrorredIcon from "@mui/icons-material/NoEncryptionGmailerrorred";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import HttpsIcon from "@mui/icons-material/Https";

import { GAMES } from "../../Enums/enums";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import RoomsHeader from "../RoomsHeader/RoomsHeader";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import ProvidenceConfig from "../Providence/ProvidenceConfig";

// import "./Home.css"
const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;

const Rooms = (props) => {
  const [allRooms, setAllRooms] = useState([]);
  // const [modalShow, setModalShow] = useState(false);
  const [createRoomError, setCreateRoomError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  // const createRoomCallback = props.createRoomCallback;
  const [newGame, setNewGame] = useState("");
  const newRoomId = useRef();
  const newSecret = useRef();
  const newUsername = useRef();
  const newDescription = useRef();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [newMaxPlayers, setNewMaxPlayers] = useState(9);
  const [gameConfig, setGameConfig] = useState({});
  const [roomConfig, setRoomConfig] = useState({});

  const createRoom = async () => {
    const dataToSend = {
      roomConfig: roomConfig,
      game: newGame,
      gameConfig: gameConfig,
    };
    console.log(dataToSend);
    const response = await axios.post(
      `${serverURL}/api/createRoom`,
      dataToSend
    );
    const data = response.data;
    console.log(data);

    if (data.success) {
      setRoomId(dataToSend.roomConfig.roomId);
      setUsername(dataToSend.roomConfig.username);
      setGameType(dataToSend.game);
      localStorage.clear();
      const localStorageObj = {
        username: dataToSend.roomConfig.username,
        roomId: dataToSend.roomConfig.roomId,
        gameType: dataToSend.game,
      };
      localStorage.setItem(
        LOCAL_STORAGE.UserInfo,
        JSON.stringify(localStorageObj)
      );
      navigate(`/room/${dataToSend.roomConfig.roomId}`);
    } else {
      setCreateRoomError(data.description);
      console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
    }
  };

  const checkIfRoomSettingsValid = async () => {
    const dataToSend = {
      roomId: newRoomId.current.value,
      auth: open,
      secret: open ? newSecret.current.value : undefined,
      username: newUsername.current.value,
      description: open2 ? newDescription.current.value : "",
      maxPlayers: newMaxPlayers,
    };
    console.log(dataToSend);
    const response = await axios.post(
      `${serverURL}/api/checkRoomSettings`,
      dataToSend
    );
    const data = response.data;
    console.log(data);

    if (data.success) {
      setRoomConfig(dataToSend);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setCreateRoomError("");
    } else {
      setCreateRoomError(data.description);
      console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
    }
  };

  // const StyledFab = styled(Fab)({
  //   position: "fixed",
  //   zIndex: 1,
  //   bottom: 20,
  //   right: 20,
  //   margin: "0 auto",
  // });

  //----------------------------
  const steps = ["Room settings", "Game settings"];

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = (activeStep) => {
    if (activeStep === steps.length - 1) {
      createRoom();
    } else if (activeStep === 0) {
      checkIfRoomSettingsValid();
    }
  };

  const handleBack = () => {
    setCreateRoomError("");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //-------------------------------

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setActiveStep(0);
    setCreateRoomError("");
  };

  const selectRender = Object.keys(GAMES).map((item) => {
    return `${item}`;
  });

  const navigate = useNavigate();

  const setGameType = props.setGameType;
  const setUsername = props.setUsername;
  const setRoomId = props.setRoomId;

  useEffect(() => {
    const localObj = JSON.parse(localStorage.getItem(LOCAL_STORAGE.UserInfo));
    if (localObj && localObj.roomId) {
      console.log(localObj.roomId);
      setRoomId(localObj.roomId);
      setUsername(localObj.username);
      navigate(`/room/${localObj.roomId}`);
    } else {
      getAllRooms();
    }
  }, []);

  const getAllRooms = async () => {
    const response = await axios.get(`${serverURL}/api/getAllRooms`);
    const data = response.data;
    if (data.success) {
      setAllRooms(data.data);
      console.log(data.data);
    } else {
      console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
    }
  };

  return (
    <div className="home">
      <RoomsHeader handleClickOpen={handleClickOpen} />
      <CardsRoom
        allRooms={allRooms}
        setRoomId={setRoomId}
        setUsername={setUsername}
      ></CardsRoom>
      <Dialog open={openDialog} onClose={handleClose} disable>
        <Box sx={{ width: "100%", height: "100%", paddingTop: 2 }}>
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <React.Fragment>
            {activeStep + 1 === 1 ? (
              <DialogContent>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: ["100%"] },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <FormControl sx={{ mt: 0 }}>
                    <TextField
                      id="outlined-sdfdfd"
                      label="Room ID"
                      variant="standard"
                      required
                      inputRef={newRoomId}
                    />
                    <Divider />
                    <br />
                    <FormLabel component="legend">
                      Maximum Players: {newMaxPlayers}
                    </FormLabel>
                    <Slider
                      aria-label=""
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
                    <Divider />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={open2}
                          onChange={() => setOpen2(!open2)}
                        />
                      }
                      label={open2 ? "" : "Add Description"}
                      labelPlacement="end"
                    />
                    <Collapse in={open2} timeout="auto" unmountOnExit>
                      <div id="example-collapse-text">
                        <TextField
                          id="outlined-sdfdfd"
                          label="Description"
                          variant="standard"
                          inputRef={newDescription}
                        />
                      </div>
                    </Collapse>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={open}
                          onChange={() => setOpen(!open)}
                        />
                      }
                      label={
                        open ? <HttpsIcon /> : <NoEncryptionGmailerrorredIcon />
                      }
                      labelPlacement="end"
                    />
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <div id="example-collapse-text">
                        <TextField
                          id="outlined-password-input"
                          label="Password"
                          type="password"
                          // variant="standard"
                          autoComplete="current-password"
                          inputRef={newSecret}
                          helperText="Enter Room Password"
                        />
                      </div>
                    </Collapse>
                    {/* <br /> */}
                    <Divider />

                    <TextField
                      // variant="standard"
                      required
                      label="Username"
                      inputRef={newUsername}
                    />
                    <Collapse
                      in={createRoomError !== ""}
                      timeout="auto"
                      unmountOnExit
                    >
                      <br />
                      <FormLabel
                        sx={{
                          color: "#d32f2f",
                        }}
                      >
                        {createRoomError}
                      </FormLabel>
                    </Collapse>
                  </FormControl>
                </Box>
              </DialogContent>
            ) : activeStep + 1 === 2 ? (
              <DialogContent>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: ["100%"] },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <FormControl sx={{ mt: 0 }}>
                    <Autocomplete
                      onChange={(event, value) => setNewGame(value)}
                      id="disabled-options-demo"
                      options={selectRender}
                      getOptionDisabled={(option) =>
                        option !== GAMES.Providence
                      }
                      value={newGame}
                      required
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select a Game" />
                      )}
                    />
                    <br />

                    {newGame === GAMES.Providence ? (
                      <ProvidenceConfig
                        gameConfig={gameConfig}
                        setGameConfig={setGameConfig}
                      />
                    ) : (
                      ""
                    )}

                    <Divider />
                    <Collapse
                      in={createRoomError !== ""}
                      timeout="auto"
                      unmountOnExit
                    >
                      <br />
                      <FormLabel
                        sx={{
                          color: "#d32f2f",
                        }}
                      >
                        {createRoomError}
                      </FormLabel>
                    </Collapse>
                  </FormControl>
                </Box>
              </DialogContent>
            ) : (
              ""
            )}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              {activeStep === 0 ? (
                <Button color="inherit" onClick={handleClose}>
                  Cancel
                </Button>
              ) : (
                <Button
                  color="inherit"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              )}

              <Box sx={{ flex: "1 1 auto" }} />

              <Button onClick={() => handleNext(activeStep)}>
                {activeStep === steps.length - 1 ? "Create" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        </Box>
      </Dialog>
    </div>
  );
};

export default Rooms;

{
  /* <Dialog open={openDialog} onClose={handleClose}>
 
</Dialog>; */
}

// <DialogActions>
{
  /* <Button variant="outlined" onClick={handleClose}>
  Cancel
</Button> */
}
// <Button variant="contained" onClick={createRoom}>
//   Create
// </Button>
// </DialogActions>
