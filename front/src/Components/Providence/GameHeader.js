import { Box, Paper } from "@mui/material";
import { PROVIDENCE_GAME_STATE } from "../../Enums/enums";
import "./GameHeader.css";
import AlarmIcon from "@mui/icons-material/Alarm";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import LinearProgress from "@mui/material/LinearProgress";

import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";

const GameHeader = (props) => {
  const gameState = props.gameState;
  const currWord = props.currWord;
  const gameConfig = props.gameConfig;
  const maxPoints = gameConfig.maxPoints;
  const clock = props.clock;
  const allPlayersClockSec = gameConfig.allPlayersClockSec;
  const currPlayerClockSec = gameConfig.currPlayerClockSec;
  const [allPlayersClockVal, setAllPlayersClockVal] = useState(0);

  useEffect(() => {
    setAllPlayersClockVal(Math.min((clock * 100) / allPlayersClockSec, 100));

    return () => {};
  }, [clock]);

  const renderSwitch = () => {
    switch (gameState) {
      case PROVIDENCE_GAME_STATE.PLAYER_CLOCK:
        return (
          <Box mt={0} sx={{ flexDirection: "row", height: "10vh" }}>
            <AlarmIcon />
            {clock}
            {currWord}
          </Box>
        );
      case PROVIDENCE_GAME_STATE.ALL_CLOCK:
        return (
          <>
            <Paper
              sx={{
                height: "10vh",
              }}
            >
              <Stack direction="row" spacing={10}>
                <Chip icon={<AlarmIcon />} label={clock} />
                <h3>{currWord} </h3>
              </Stack>
              <Stack item xs={1}>
                <LinearProgress
                  variant="determinate"
                  value={allPlayersClockVal}
                />
              </Stack>
            </Paper>
          </>
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
        return (
          <Box mt={0} sx={{ height: "10vh" }}>
            <Typography variant="h4" mt={0}>
              Providence
            </Typography>
            <Typography variant="subtitle1" mt={0}>
              {/* Please wait for all players to join */}
              A- {allPlayersClockSec}
              B- {maxPoints}C - {currPlayerClockSec}
            </Typography>
          </Box>
        );
    }
  };

  return renderSwitch();
};

export default GameHeader;
