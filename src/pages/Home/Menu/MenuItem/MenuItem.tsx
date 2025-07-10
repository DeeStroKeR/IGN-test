import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  paper: {
    padding: "1rem",
    display: "flex",
    flex: 1,
  },
  box: {
    background: "#eee",
    "&:hover": {
      background: "#ddd",
    },
  },
});

interface MenuItemProps {
  name: string;
  description: string;
  link: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, description, link }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      item
      xs={12}
      sm={6}
      md={4}
      direction="column"
      component={NavLink}
      to={link}
    >
      <Paper className={classes.paper} elevation={6}>
        <Box p={4} className={classes.box}>
          <Typography
            color="inherit"
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            {name}
          </Typography>
          <Typography color="inherit" variant="body1">
            {description}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default MenuItem;
