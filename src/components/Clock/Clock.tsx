import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
  "@keyframes breatheIn": {
    "0%": {
      boxShadow: "0 0 0 0px rgba(255, 161, 122, 0.3), 0 0 0 0px rgba(255, 161, 122, 0.3), 0 0 0 0px rgba(255, 161, 122, 0.3)",
    },
    "100%": {
      boxShadow: "0 0 0 30px rgba(255, 161, 122, 0.3), 0 0 0 60px rgba(255, 161, 122, 0.3), 0 0 0 90px rgba(255, 161, 122, 0.3)",
    },
  },
  "@keyframes breatheOut": {
    "0%": {
      boxShadow: "0 0 0 30px rgba(255, 161, 122, 0.3), 0 0 0 60px rgba(255, 161, 122, 0.3), 0 0 0 90px rgba(255, 161, 122, 0.3)",
    },
    "100%": {
      boxShadow: "0 0 0 0px rgba(255, 161, 122, 0.3), 0 0 0 0px rgba(255, 161, 122, 0.3), 0 0 0 0px rgba(255, 161, 122, 0.3)",
    },
  },
  breatheIn: {
    display: "flex",
    flexDirection: "column",
    color: "transparent",
    margin: "5rem 0",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255, 161, 122, 1)",
    animation: `$breatheIn 4s linear infinite`,
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      width: "200px",
      height: "200px",
    },
  },
  breatheOut: {
    display: "flex",
    flexDirection: "column",
    color: "transparent",
    margin: "5rem 0",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255, 161, 122, 1)",
    animation: `$breatheOut 4s linear infinite`,
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      width: "200px",
      height: "200px",
    },
  },
  holdIn: {
    display: "flex",
    flexDirection: "column",
    color: "transparent",
    margin: "5rem 0",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255, 161, 122, 1)",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      width: "200px",
      height: "200px",
    },
  },
  holdOut: {
    display: "flex",
    flexDirection: "column",
    color: "transparent",
    margin: "5rem 0",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255, 161, 122, 1)",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 0 30px rgba(255, 161, 122, 0.3), 0 0 0 60px rgba(255, 161, 122, 0.3), 0 0 0 90px rgba(255, 161, 122, 0.3)",
    [theme.breakpoints.up("sm")]: {
      width: "200px",
      height: "200px",
    },
  },
  time: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.25rem",
    },
  },
  variant: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
}));

export type AnimationClass = "breatheIn" | "breatheOut" | "holdIn" | "holdOut";

interface ClockProps {
  time?: number;
  variant?: string;
  animation?: AnimationClass;
}

const Clock = ({ time = 0, variant = "default", animation = "breatheIn" }: ClockProps) => {
  const classes = useStyles();
  return (
    <div className={classes[animation]}>
      <Typography
        variant="h2"
        color="#fff"
        fontWeight="700"
        className={classes.time}
      >
        {time}
      </Typography>
      <Typography
        variant="h5"
        color="#fff"
        fontWeight="700"
        gutterBottom
        className={classes.variant}
      >
        {variant}
      </Typography>
    </div>
  );
};

export default Clock;
