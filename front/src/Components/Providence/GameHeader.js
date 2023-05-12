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

import { styled } from "@mui/material/styles";

const GameHeader = (props) => {
  const gameState = props.gameState;
  const currWord = props.currWord;

  const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(1),
  }));

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
          <Paper
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              listStyle: "none",
              p: 0.5,
              m: 1,
              height: "10vh",
            }}
            component="ul"
          >
            <Stack m={"auto"} direction="row" spacing={3}>
              <Chip size="medium" icon={<AlarmIcon />} label={"data.label"} />
              <Chip icon={<AlarmIcon />} label={"data.label"} />
              <Chip icon={<AlarmIcon />} label={"data.label"} />
            </Stack>
          </Paper>
          // <Stack direction="row" spacing={5} sx={{height: "10vh"}}>
          //   <Chip icon={<FaceIcon />} label="With Icon" />
          //   <Chip icon={<FaceIcon />} label="With Icon" variant="outlined" />
          //   <Chip icon={<FaceIcon />} label="With Icon" variant="outlined" />
          // </Stack>
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
              Please wait for all players to join
            </Typography>
          </Box>
        );
    }
  };

  return renderSwitch();
};

export default GameHeader;
