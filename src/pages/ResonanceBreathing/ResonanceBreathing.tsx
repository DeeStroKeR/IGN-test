import { useState } from "react";
import Wrapper from "../../components/Wrapper/Wrapper";
import Toolbar from "../../components/Toolbar/Toolbar";
import Box from "@mui/material/Box";
import Description from "./Description/Description";
import Timer from "./Timer/Timer";

function ResonanceBreathing() {
  const [start, setStart] = useState(false);
  return (
    <Wrapper alignItems="flex-start">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Toolbar title="Resonance Frequency Breathing" />
        {start && <Timer/>}
        {!start && <Description setStart={setStart} />}
      </Box>
    </Wrapper>
  );
}

export default ResonanceBreathing;
