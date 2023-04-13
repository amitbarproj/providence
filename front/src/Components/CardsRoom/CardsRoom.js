import CardRoom from "../CardRoom/CardRoom";

const CardsRoom = (props) => {
  const renderList = props.allRooms.map((item, index) => (
    <CardRoom
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
  return <>{renderList}</>;
};

export default CardsRoom;
