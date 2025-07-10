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
});

const steps = [
  "Find a nice place to sit with your back straight.",
  "Close your mouth and inhale quietly through your nose for a count of four.",
  "Hold your breath for a count of seven.",
  "Exhale completely through your mouth making a whoosh sound for a count of eight. Get all the air out of your lungs.",
  "Repeat for 4-7 more cycles.",
];
const Description = ({ setStart }: { setStart: (value: boolean) => void }) => {
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
                <ListItemIcon>
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
