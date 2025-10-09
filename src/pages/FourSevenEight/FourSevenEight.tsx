import { useState } from "react";
import Toolbar from "../../components/Toolbar/Toolbar";
import Box from "@mui/material/Box";
import Description from "./Description/Description";
import Timer from "./Timer/Timer";
import styles from './fourSevenEight.module.scss';

function FourSevenEight() {
  const [start, setStart] = useState(false);
  return (
    <div className={styles.wrapper}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Toolbar title="4-7-8 Breathing" />
        {start && <Timer />}
        {!start && <Description setStart={setStart} />}
      </Box>
    </div>
  );
}

export default FourSevenEight;
