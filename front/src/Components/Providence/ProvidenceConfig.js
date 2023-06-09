import { useState, useEffect } from "react";

import FormLabel from "@mui/material/FormLabel";

import Slider from "@mui/material/Slider";
import { Divider } from "@mui/material";

const ProvidenceConfig = (props) => {
  const setGameConfig = props.setGameConfig;
  const gameConfig = props.gameConfig;
  const [maxPoints, setMaxPoints] = useState(10);
  const [time, setTime] = useState(15);

  useEffect(() => {
    setGameConfig({
      maxPoints: 10,
      time: 15,
    });
  }, []);

  return (
    <>
      <FormLabel component="legend">Points to win: {maxPoints}</FormLabel>
      <Slider
        aria-label=""
        color="primary"
        value={maxPoints}
        onChange={(e) => {
          setMaxPoints(Number(e.target.value));
          setGameConfig({ ...gameConfig, maxPoints: Number(e.target.value) });
        }}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={20}
      />
      <Divider />
      <br />
      <FormLabel component="legend">Time: {time}</FormLabel>
      <Slider
        color="secondary"
        aria-label=""
        value={time}
        onChange={(e) => {
          setTime(Number(e.target.value));
          setGameConfig({
            ...gameConfig,
            allPlayersClockSec: Number(e.target.value),
            currPlayerClockSec: Number(e.target.value),
          });
        }}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={5}
        max={26}
      />
    </>
  );
};

export default ProvidenceConfig;
