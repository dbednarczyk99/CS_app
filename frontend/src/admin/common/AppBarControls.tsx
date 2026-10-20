import { useTheme } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useNavHistory } from './nav-history';

/**
 * Strzałki w górnym pasku: „← tytuł poprzedniego ekranu” i „→” (następny – z podpowiedzią). Działają jak
 * strzałki przeglądarki; na telefonie sama ikona z podpowiedzią.
 */
export function NavArrows() {
  const navigate = useNavigate();
  const { back, forward } = useNavHistory();
  if (!back && !forward) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, minWidth: 0 }}>
      {back && (
        <Tooltip title={`Wróć do: ${back}`}>
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{
              minWidth: 0,
              maxWidth: { xs: 40, md: 260 },
              textTransform: 'none',
              letterSpacing: 0,
              fontFamily: 'inherit',
              opacity: 0.85,
              '&:hover': { opacity: 1 },
              '& .MuiButton-startIcon': { mr: { xs: 0, md: 0.75 } },
            }}
            aria-label={`Wróć do: ${back}`}
          >
            <Box
              component="span"
              sx={{ display: { xs: 'none', md: 'block' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {back}
            </Box>
          </Button>
        </Tooltip>
      )}
      {forward && (
        <Tooltip title={`Dalej do: ${forward}`}>
          <IconButton color="inherit" size="small" onClick={() => navigate(1)} aria-label={`Dalej do: ${forward}`} sx={{ opacity: 0.85 }}>
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

/** Przełącznik trybu: w ciemnym – słońce („włącz jasny”), w jasnym – księżyc („włącz ciemny”) */
export function ThemeToggle() {
  const [theme, setTheme] = useTheme('dark');
  const dark = theme !== 'light';
  const title = dark ? 'Włącz tryb jasny' : 'Włącz tryb ciemny';
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={title}>
        {dark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}
