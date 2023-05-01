import ProvidencePlayer from "./ProvidencePlayer";
import "./ProvidencePlayers.css"

const ProvidencePlayers = (props) => {
  const renderList = props.players.map((item, index) => (
    <ProvidencePlayer
      className="player-card"
      player={item}
    ></ProvidencePlayer>
  ));
  return <div className="players-cards">{renderList}</div>;
};

export default ProvidencePlayers;
