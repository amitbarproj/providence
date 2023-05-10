import { PROVIDENCE_GAME_STATE } from "../../Enums/enums";
import "./GameHeader.css";
import AlarmIcon from "@mui/icons-material/Alarm";

const GameHeader = (props) => {
  const gameState = props.gameState;
  const currWord = props.currWord;
  return (
    <div className="providence-header">
      {currWord && (gameState === PROVIDENCE_GAME_STATE.ALL_CLOCK || gameState === PROVIDENCE_GAME_STATE.CALCULATE_ROUND ) && (
        <h1>
          <AlarmIcon />
          {props.clock}
          {currWord}
        </h1>
      )}
    </div>
  );
};

export default GameHeader;
