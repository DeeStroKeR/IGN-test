import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import Clock, { AnimationClass } from "../../../components/Clock/Clock";

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

const Timer = () => {
  const [state, setState] = useState({
    time: 6,
    seconds: 6,
    animation: "breatheIn" as AnimationClass,
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
          time: 6,
          seconds: 6,
          animation: "breatheOut",
          variant: "Exhale",
        });
      } else if (state.animation === "breatheOut") {
        setState({
          time: 6,
          seconds: 6,
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
