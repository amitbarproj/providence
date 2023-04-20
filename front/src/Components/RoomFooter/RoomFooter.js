import Button from '@mui/material/Button';


const RoomFooter = (props) => {
  const isAdmin = props.isAdmin;
  const gameStarted = props.gameStarted;
  const startGame = props.startGame;
  const leaveRoom = props.leaveRoom;

  return (
    <div className="">
      {" "}
      {isAdmin && !gameStarted && (
        <Button variant="contained" onClick={() => startGame()}>
          Strat Game
        </Button>
      )}
      <Button variant="contained" onClick={() => leaveRoom()}>
        Leave Room
      </Button>
    </div>
  );
};

export default RoomFooter;
