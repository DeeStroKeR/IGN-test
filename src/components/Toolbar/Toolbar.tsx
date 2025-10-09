import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

function Toolbar({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <Box display="flex" alignItems="center" marginBottom="1.5rem">
      <IconButton onClick={() => {navigate(-1)}} color="inherit" size="large">
        <KeyboardBackspaceIcon fontSize="large" />
      </IconButton>
      <Typography variant="h3" fontWeight="700" marginLeft="1rem" fontSize={{ xs: '24px', lg: '48px' }}>
        {title}
      </Typography>
    </Box>
  );
}

export default Toolbar;
