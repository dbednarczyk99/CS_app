import { useTheme } from 'react-admin';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { parentScreen } from './parent-screen';

/**
 * Strzałka w górnym pasku do ekranu nadrzędnego, np. w edycji produktu „← Produkty”. Na ekranach głównych
 * z menu jej nie ma. Na telefonie sama strzałka (nazwa w podpowiedzi).
 */
export function ParentLink() {
  const { pathname } = useLocation();
  const parent = parentScreen(pathname);
  if (!parent) return null;
  return (
    <Tooltip title={`Wróć do: ${parent.label}`}>
      <Button
        component={Link}
        to={parent.to}
        color="inherit"
        size="small"
        startIcon={<ArrowBackIcon />}
        aria-label={`Wróć do: ${parent.label}`}
        sx={{
          mr: 2,
          minWidth: 0,
          flexShrink: 0,
          textTransform: 'none',
          letterSpacing: 0,
          opacity: 0.85,
          '&:hover': { opacity: 1 },
          '& .MuiButton-startIcon': { mr: { xs: 0, md: 0.75 } },
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, whiteSpace: 'nowrap' }}>
          {parent.label}
        </Box>
      </Button>
    </Tooltip>
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
