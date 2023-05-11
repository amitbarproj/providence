import { Box, Paper } from "@mui/material";
import { PROVIDENCE_GAME_STATE } from "../../Enums/enums";
import "./GameHeader.css";
import AlarmIcon from "@mui/icons-material/Alarm";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";

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
          <Paper elevation={3} sx={{ height: "10vh" }}>
            <Box mt={0} sx={{ flexDirection: "row", height: "10vh" }}>
              <AlarmIcon />
              {props.clock}
              <Paper elevation={3} sx={{ backgroundColor: "red" }}>
                {currWord}
              </Paper>
            </Box>
          </Paper>
        );
      case PROVIDENCE_GAME_STATE.CALCULATE_ROUND:
        return (
          <Box mt={0} sx={{ flexDirection: "row", height: "10vh" }}>
            {/* <AlarmIcon />
            {props.clock}
            {currWord} */}
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
        return (
          <Box mt={0} sx={{ height: "10vh" }}>
            <Typography variant="h6">Welcome</Typography>
            <Typography variant="subtitle1">
              Please wait for all players to join
            </Typography>
          </Box>
        );
    }
  };

  return renderSwitch();
};

export default GameHeader;
