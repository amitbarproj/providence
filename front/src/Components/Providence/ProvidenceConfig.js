import { useState, useEffect, useRef, forwardRef } from "react";

import FormLabel from "@mui/material/FormLabel";

import Slider from "@mui/material/Slider";

const ProvidenceConfig = (props) => {
  const setGameConfig = props.setGameConfig;
  const [maxPoints, setMaxPoints] = useState(10);

  return (
    <>
      {" "}
      <FormLabel component="legend">Maximum Points: {maxPoints}</FormLabel>
      <Slider
        aria-label=""
        value={maxPoints}
        onChange={(e) => {
          setMaxPoints(Number(e.target.value));
          setGameConfig({ maxPoints: Number(e.target.value) });
 

        }}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={20}
      />
    </>
  );
};

export default ProvidenceConfig;
