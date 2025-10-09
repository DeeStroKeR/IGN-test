import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import Clock from "../../../components/Clock/Clock";

const useStyles = makeStyles({
  paper: {
    padding: "1rem",
  },
  "@media (max-width: 768px)": {
    paper: {
      padding: "0",
    },
  },
});

import type { AnimationClass } from "../../../components/Clock/Clock";

const Timer = () => {
  const [state, setState] = useState<{
    time: number;
    seconds: number;
    animation: AnimationClass;
    variant: string;
  }>({
    time: 4,
    seconds: 4,
    animation: "breatheIn",
    variant: "Inhale",
  });
  const classes = useStyles();
  useEffect(() => {
    const timer1 = setInterval(() => {
      setState((curr) => {
        const copy = { ...curr };
        copy.time = copy.time - 1;
        return copy;
      });
    }, 1000);
    return () => clearInterval(timer1);
  }, []);

  useEffect(() => {
    if (state.time === 0) {
      if (state.animation === "breatheIn") {
        setState({
          time: 7,
          seconds: 7,
          animation: "holdOut",
          variant: "Hold",
        });
      } else if (state.animation === "holdOut") {
        setState({
          time: 8,
          seconds: 8,
          animation: "breatheOut",
          variant: "Exhale",
        });
      } else if (state.animation === "breatheOut") {
        setState({
          time: 4,
          seconds: 4,
          animation: "breatheIn",
          variant: "Inhale",
        });
      }
    }
  }, [state.time, state.animation]);
  return (
    <Paper className={classes.paper} elevation={6}>
      <Box
        p={4}
        display="flex"
        flexDirection="column"
        bgcolor="#eee"
        alignItems="center"
      >
        <Clock
          key={state.animation}
          animation={state.animation}
          variant={state.variant}
          time={state.time}
        />
      </Box>
    </Paper>
  );
};

export default Timer;
