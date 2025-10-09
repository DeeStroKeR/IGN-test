import Typography from "@mui/material/Typography";
import Menu from "./Menu/Menu";
import styles from './home.module.scss';

function BreatheHomepage() {
  return (
    <div className={styles.wrapper}>
      <Typography variant="h2" fontWeight="700" className={styles.title}>
        Guided Breathing Timer
      </Typography>
      <Typography variant="h6" color="#8D9099" className={styles.description}>
        3 Deep Breathing Exercises to Reduce Anxiety. Choose the type from the
        menu bellow and enjoy your journey!
      </Typography>
      <Menu />
    </div>
  );
}

export default BreatheHomepage;
