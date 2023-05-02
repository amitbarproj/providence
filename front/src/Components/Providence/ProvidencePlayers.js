import ProvidencePlayer from "./ProvidencePlayer";
import "./ProvidencePlayers.css";

const ProvidencePlayers = (props) => {
  const renderList = props.players.map((item, index) => {
    return (
      <ProvidencePlayer
        className="player-card"
        player={item}
        myUsername={props.myUsername}
        sendGameMsgToServer={props.sendGameMsgToServer}
        isMe={item.username === props.myUsername? true : false}
        gameStarted={props.gameStarted}
        currPlayerClock={props.currPlayerClock}
        clock={props.clock}
      ></ProvidencePlayer>
    );
  });
  return <div className="players-cards">{renderList}</div>;
};

export default ProvidencePlayers;
