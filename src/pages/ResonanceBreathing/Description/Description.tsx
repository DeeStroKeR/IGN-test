import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles({
  paper: {
    padding: "1rem",
  },
  startButton: {
    marginTop: "1.5rem",
    alignSelf: "center",
  },
  icon: {},
  "@media (max-width: 768px)": {
    paper: {
      padding: "0",
    },
    icon: {
      minWidth: '24px !important',
      '& svg': {
        fontSize: '16px !important',
      }
    },
  },
});

const steps = [
  "Lie down and close your eyes.",
  "Gently breathe in through your nose, mouth closed, for a count of six seconds. Don't fill your lungs too full of air.",
  "Exhale for six seconds, allowing your breath to leave your body slowly and gently without forcing it.",
  "Continue for up to 10 minutes.",
  "Take a few additional minutes to be still and focus on how your body feels.",
];
interface DescriptionProps {
  setStart: (value: boolean) => void;
}

const Description = ({ setStart }: DescriptionProps) => {
  const classes = useStyles();
  const startMeditation = () => {
    setStart(true);
  };
  return (
    <Paper className={classes.paper} elevation={6}>
      <Box
        p={2}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        bgcolor="#eee"
      >
        <List
          dense
          subheader={
            <Typography gutterBottom variant="h5">
              Instructions
            </Typography>
          }
        >
          {steps.map((step, index) => {
            return (
              <ListItem key={index}>
                <ListItemIcon className={classes.icon}>
                  <FiberManualRecordIcon />
                </ListItemIcon>
                <ListItemText primary={step} />
              </ListItem>
            );
          })}
        </List>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={startMeditation}
          className={classes.startButton}
        >
          Start
        </Button>
      </Box>
    </Paper>
  );
};

export default Description;
