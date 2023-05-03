import MyProviPlayer from "./MyProviPlayer";
import ProvidencePlayer from "./ProvidencePlayer";
import "./ProvidencePlayers.css";

const ProvidencePlayers = (props) => {
  const renderList = props.players.map((item, index) => {
    if (item.username === props.myUsername) {
      return (
        <MyProviPlayer
          className="player-card"
          player={item}
          sendGameMsgToServer={props.sendGameMsgToServer}
          gameStarted={props.gameStarted}
          currPlayerClock={props.currPlayerClock}
          clock={props.clock}
        ></MyProviPlayer>
      );
    } else {
      return (
        <ProvidencePlayer
          className="player-card"
          player={item}
          gameStarted={props.gameStarted}
        ></ProvidencePlayer>
      );
    }
  });
  return <div className="players-cards">{renderList}</div>;
};

export default ProvidencePlayers;
