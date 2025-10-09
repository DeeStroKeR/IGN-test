import { useState } from "react";
import Toolbar from "../../components/Toolbar/Toolbar";
import Box from "@mui/material/Box";
import Description from "./Description/Description";
import Timer from "./Timer/Timer";
import styles from '../FourSevenEight/fourSevenEight.module.scss';

function PursedLipBreathing() {
  const [start, setStart] = useState(false);
  return (
    <div className={styles.wrapper}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Toolbar title="Pursed Lip Breathing" />
        {start && <Timer />}
        {!start && <Description setStart={setStart} />}
      </Box>
    </div>
  );
}

export default PursedLipBreathing;
