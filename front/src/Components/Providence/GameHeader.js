import { Paper } from "@mui/material";
import {
  BACKGROUNDS,
  PROVIDENCE_GAME_STATE,
} from "../../Enums/enums";
import { createTheme } from '@mui/material/styles';

import "./GameHeader.css";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

import { useState, useEffect } from "react";

const GameHeader = (props) => {
  const gameState = props.gameState;
  const currWord = props.currWord;
  const gameConfig = props.gameConfig;
  // const maxPoints = gameConfig.maxPoints;
  const clock = props.clock;
  const allPlayersClockSec = gameConfig.allPlayersClockSec;
  const [allPlayersClockVal, setAllPlayersClockVal] = useState(0);

  const theme = createTheme({
    typography: {
      fontFamily: [
   
      ].join(','),
    },
  });

  useEffect(() => {
    setAllPlayersClockVal((clock * 100) / allPlayersClockSec);
    console.log(clock);

    return () => {};
  }, [clock]);

  const renderSwitch = () => {
    switch (gameState) {
      case PROVIDENCE_GAME_STATE.PLAYER_CLOCK:
        return (
          <Paper
            sx={{
              height: "4rem",
              backgroundColor: BACKGROUNDS.GameHeader,
            }}
          ></Paper>
        );
      case PROVIDENCE_GAME_STATE.ALL_CLOCK:
        return (
          <Paper
            sx={{
              height: "4rem",
              backgroundColor: BACKGROUNDS.GameHeader,
            }}
          >
            <Stack
              direction="column"
              spacing={1}
              marginLeft={2}
              marginRight={2}
            >
              <Typography theme={theme} variant="h5" color="warning" fontWeight={600}>
                {currWord}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={allPlayersClockVal}
                color={
                  clock < 3
                    ? "error"
                    : clock < allPlayersClockSec / 2
                    ? "warning"
                    : "primary"
                }
              />
            </Stack>
          </Paper>
        );
      case PROVIDENCE_GAME_STATE.CALCULATE_ROUND:
        return (
          <Paper
            sx={{
              height: "4rem",
              backgroundColor: BACKGROUNDS.GameHeader,
            }}
          >
            <Typography theme={theme} variant="h5" color="warning" fontWeight={600}>
                {currWord}
              </Typography>
          </Paper>
        );
      case PROVIDENCE_GAME_STATE.END_OF_GAME:
        return (
          <Paper
            sx={{
              height: "4rem",
              backgroundColor: BACKGROUNDS.GameHeader,
            }}
          ></Paper>
        );
      default:
        return (
          <Paper
            sx={{
              height: "4rem",
              backgroundColor: BACKGROUNDS.GameHeader,
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
