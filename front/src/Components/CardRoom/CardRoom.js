import { useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { BsFillLockFill } from "react-icons/bs";
import JoinRoomModal from "../JoinRoomModal/JoinRoomModal";
import "./CardRoom.css";
const serverURL = `http://10.0.0.8:3002`;

const CardRoom = (props) => {
  const roomId = props.roomId;
  const auth = props.auth;
  const numOfPlayers = props.numOfPlayers;
  const gameType = props.gameType;
  const maxPlayers = props.maxPlayers;
  const gameStarted = props.gameStarted;
  const description = props.description;
  const setRoomId = props.setRoomId;
  const setUsername = props.setUsername;
  const setInRoom = props.setInRoom;

  const [modalShow, setModalShow] = useState(false);
  const [joinRoomError, setJoinRoomError] = useState("");

  const joinRoom = async (dataToSendd) => {
    const dataToSend = {
      roomId: roomId,
      username: dataToSendd.username,
      secret: dataToSendd.secret,
    };
    console.log(dataToSend);
    const response = await axios.post(`${serverURL}/joinRoom`, dataToSend);
    const data = response.data;
    console.log(data);

    if (data.success) {
      setModalShow(false);
      setRoomId(roomId);
      setUsername(dataToSendd.username);
      setInRoom(true);
    } else {
      setJoinRoomError(data.description);
    }
  };

  return (
    <Card>
      <Card.Header>Room ID: {roomId}</Card.Header>
      <Card.Body>
        <Card.Title>{gameType}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Players: {numOfPlayers}/{maxPlayers}
        </Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        {auth && <BsFillLockFill />}
      </Card.Body>
      <Button disabled={gameStarted} variant="primary" onClick={() => setModalShow(true)}>
        {gameStarted? "Game Started" : "Join Room"}
      </Button>
      <JoinRoomModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        joinRoomCallback={joinRoom}
        roomId={roomId}
        auth={auth}
        joinRoomError={joinRoomError}
      />
    </Card>
  );
};

export default CardRoom;
