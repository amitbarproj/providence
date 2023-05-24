import { useRef } from "react";

import CardRoom from "../CardRoom/CardRoom";
import "./CardsRoom.css";
import Lottie from "lottie-react";
import animationData from "../../assets/93134-not-found.json";
const CardsRoom = (props) => {
  const emptyRoomsRef = useRef();
  const renderList = props.allRooms.map((item, index) => (
    <CardRoom
      className="card"
      roomId={item.roomId}
      auth={item.auth}
      gameType={item.gameType}
      numOfPlayers={item.numOfPlayers}
      maxPlayers={item.maxPlayers}
      gameStarted={item.isStarted}
      description={item.description}
      setRoomId={props.setRoomId}
      setUsername={props.setUsername}
    ></CardRoom>
  ));
  return (
    <div>
      {renderList.length === 0 ? (
        <Lottie
          loop
          lottieRef={emptyRoomsRef}
          animationData={animationData}
          style={{
            marginInline: "auto",
          }}
        />
      ) : (
        <div className="cards">{renderList}</div>
      )}
    </div>
  );
};

export default CardsRoom;
