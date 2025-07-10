import Typography from "@mui/material/Typography";
import Menu from "./Menu/Menu";
import Wrapper from "../../components/Wrapper/Wrapper";

function BreatheHomepage() {
  return (
    <Wrapper>
      <Typography variant="h2" fontWeight="700">
        Guided Breathing Timer
      </Typography>
      <Typography variant="h6" color="#8D9099">
        3 Deep Breathing Exercises to Reduce Anxiety. Choose the type from the
        menu bellow and enjoy your journey!
      </Typography>
      <Menu />
    </Wrapper>
  );
}

export default BreatheHomepage;
