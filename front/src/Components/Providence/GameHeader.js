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

import { useState, useEffect } from "react";

const GameHeader = (props) => {
  const gameState = props.gameState;
  const currWord = props.currWord;
  const gameConfig = props.gameConfig;
  const maxPoints = gameConfig.maxPoints;
  const clock = props.clock;
  const allPlayersClockSec = gameConfig.allPlayersClockSec;
  const [allPlayersClockVal, setAllPlayersClockVal] = useState(0);

  useEffect(() => {
    setAllPlayersClockVal((clock * 100) / allPlayersClockSec);
    return () => {};
  }, [clock]);

  const renderSwitch = () => {
    switch (gameState) {
      case PROVIDENCE_GAME_STATE.PLAYER_CLOCK:
        return (
          <Paper
            sx={{
              height: "4rem",
            }}
          >
         
          </Paper>
        );
      case PROVIDENCE_GAME_STATE.ALL_CLOCK:
        return (
          <Paper
            sx={{
              height: "4rem",
            }}
          >
            <Stack
              direction="column"
              spacing={1}
              marginLeft={2}
              marginRight={2}
            >
              <Typography variant="h5" fontWeight={600}>
                {currWord}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={allPlayersClockVal}
              />
            </Stack>
          </Paper>
        );
      case PROVIDENCE_GAME_STATE.CALCULATE_ROUND:
        return (
          <Paper
            sx={{
              height: "4rem",
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              {currWord}
            </Typography>
          </Paper>
        );
      case PROVIDENCE_GAME_STATE.END_OF_GAME:
        return (
          <Paper
            sx={{
              height: "4rem",
            }}
          ></Paper>
        );
      default:
        return (
          <Paper
            sx={{
              height: "4rem",
            }}
          >
            <Typography variant="h5" fontWeight={600} mt={0}>
              Providence
            </Typography>
            <Typography variant="subtitle1" mt={0}>
              Please wait for all players to join
            </Typography>
          </Paper>
        );
    }
  };

  return renderSwitch();
};

export default GameHeader;
