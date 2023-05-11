import { Box, Paper } from "@mui/material";
import { PROVIDENCE_GAME_STATE } from "../../Enums/enums";
import "./GameHeader.css";
import AlarmIcon from "@mui/icons-material/Alarm";

const GameHeader = (props) => {
  const gameState = props.gameState;
  const currWord = props.currWord;

  const renderSwitch = () => {
    switch (gameState) {
      case PROVIDENCE_GAME_STATE.PLAYER_CLOCK:
        return (
          <Box mt={0} sx={{ flexDirection: "row", height: "10vh" }}>
            <AlarmIcon />
            {props.clock}
            {currWord}
          </Box>
        );
      case PROVIDENCE_GAME_STATE.ALL_CLOCK:
        return (
          <Box mt={0} sx={{ flexDirection: "row", height: "10vh" }}>
            <AlarmIcon />
            {props.clock}
            {currWord}
          </Box>
        );
      case PROVIDENCE_GAME_STATE.CALCULATE_ROUND:
        return (
          <Box mt={0} sx={{ flexDirection: "row", height: "10vh" }}>
            <AlarmIcon />
            {props.clock}
            {currWord}
          </Box>
        );
      case PROVIDENCE_GAME_STATE.END_OF_GAME:
        return (
          <Box mt={0} sx={{ flexDirection: "row", height: "10vh" }}>
            <AlarmIcon />
            {props.clock}
            {currWord}
          </Box>
        );
      default:
        return <h1>Providence</h1>;
    }
  };

  return renderSwitch();
};

export default GameHeader;
