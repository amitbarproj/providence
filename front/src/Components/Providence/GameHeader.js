import { PROVIDENCE_GAME_STATE } from "../../Enums/enums";
import "./GameHeader.css";
import AlarmIcon from "@mui/icons-material/Alarm";

const GameHeader = (props) => {
  const gameState = props.gameState;
  const currWord = props.currWord;
  return (
    <div className="providence-header">
      <h1>
        {gameState === PROVIDENCE_GAME_STATE.ALL_CLOCK ?  currWord  : ""}
      </h1>
      <h1>
        <AlarmIcon />
        {props.clock}
      </h1>
    </div>
  );
};

export default GameHeader;
