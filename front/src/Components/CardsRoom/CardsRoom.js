import CardRoom from "../CardRoom/CardRoom";
import "./CardsRoom.css"

const CardsRoom = (props) => {
  const renderList = props.allRooms.map((item, index) => (
    <CardRoom
      className="card"
      roomId={item.roomId}
      auth={item.auth}
      numOfPlayers={item.numOfPlayers}
      maxPlayers={item.maxPlayers}
      description={item.description}
      setRoomId={props.setRoomId}
      setUsername={props.setUsername}
      setInRoom={props.setInRoom}
    ></CardRoom>
  ));
  return <div className="cards">{renderList}</div>;
};

export default CardsRoom;
