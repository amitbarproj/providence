import CardRoom from "../CardRoom/CardRoom";
import "./CardsRoom.css"

const CardsRoom = (props) => {
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
  return <div className="cards">{renderList}</div>;
};

export default CardsRoom;
