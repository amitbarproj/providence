import ProvidencePlayer from "./ProvidencePlayer";
import "./ProvidencePlayers"

const ProvidencePlayers = (props) => {
  const renderList = props.players.map((item, index) => (
    <ProvidencePlayer
      className="card"
      player={item}
    ></ProvidencePlayer>
  ));
  return <div className="cards">{renderList}</div>;
};

export default ProvidencePlayers;
