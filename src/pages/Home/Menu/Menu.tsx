import Grid from "@mui/material/Grid";
import MenuItem from "./MenuItem/MenuItem";

const meditations = [
  {
    name: "4-7-8 Breathing",
    description:
      'The 4-7-8 breathing is well known as the "calming breath" technique. It involves breathing in for 4 seconds, holding the breath for 7 seconds, and exhaling for 8 seconds. This breathing exercise serves as a natural tranquilizer for our nervous system',
    link: "478-breathing",
  },
  {
    name: "Resonance Frequency Breathing",
    description:
      "Resonance frequency breathing is a powerful technique that helps you reduce your breathing rate to 5-7 breaths per second. It heals depression and lowers anxiety.",
    link: "resonance-breathing",
  },
  {
    name: "Pursed Lip Breathing",
    description:
      "Pursed Lip Breathing is a breathing technique designed to make your breaths more effective and improve your lung function. This is very helpful for people who have lung conditions such as Asthma, COPD or Pulmonary Fibrosis.",
    link: "pursed-lip-breathing",
  },
];
const Menu = () => {
  return (
    <Grid container spacing={2} marginTop={2}>
      {meditations.map(
        (
          meditation,
          index //map through the meditations array
        ) => (
          <MenuItem
            key={index}
            name={meditation.name}
            description={meditation.description}
            link={meditation.link}
          /> //pass the meditation object as props to the MenuItem component
        )
      )}
    </Grid>
  );
};

export default Menu;
