import ProvidencePlayer from "./ProvidencePlayer";
import "./ProvidencePlayers.css";

const ProvidencePlayers = (props) => {
  const renderList = props.players.map((item, index) => {
    return (
      <ProvidencePlayer
        className="player-card"
        player={item}
        myUsername={props.myUsername}
        isMe={item.username === props.myUsername? true : false}
      ></ProvidencePlayer>
    );
  });
  return <div className="players-cards">{renderList}</div>;
};

export default ProvidencePlayers;
