import { defaultDarkTheme, defaultLightTheme, type RaThemeOptions } from 'react-admin';
import { deepmerge } from '@mui/utils';

/*
 * Motyw panelu w barwach strony piekarni: grafit, kremowa biel, złote akcenty; Oswald (nagłówki,
 * przyciski – wielkie litery) i Lato (tekst). Domyślnie ciemny jak strona; jasny dla osób, które
 * wolą pracować na jasnym tle (przełącznik w górnym pasku). Pasek górny w obu trybach ciemny – z logo.
 */
export const COLORS = {
  ink: '#141618',
  coal: '#1a1d20',
  graphite: '#212529',
  graphiteLight: '#2b3035',
  cream: '#f4efe6',
  stone: '#b9b1a4',
  gold: '#c9a36a',
  goldLight: '#dcc095',
  goldDark: '#8a6a35', // złoto czytelne na jasnym tle
  line: 'rgba(244, 239, 230, 0.12)',
};

const DISPLAY = '"Oswald", "Arial Narrow", sans-serif';
const BODY = '"Lato", "Segoe UI", Arial, sans-serif';

const heading = { fontFamily: DISPLAY, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };

/** Wspólne dla obu trybów: czcionki, kształty, wygląd przycisków, tabel i menu */
const shared = (mode: 'light' | 'dark'): RaThemeOptions => {
  const accent = mode === 'dark' ? COLORS.gold : COLORS.goldDark;
  return {
    shape: { borderRadius: 2 },
    sidebar: { width: 260, closedWidth: 50 },
    typography: {
      fontFamily: BODY,
      h1: heading,
      h2: heading,
      h3: heading,
      h4: heading,
      h5: heading,
      h6: { ...heading, fontWeight: 400 },
      overline: { fontFamily: DISPLAY, letterSpacing: '0.3em', fontSize: '0.7rem' },
      subtitle2: { fontFamily: DISPLAY, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 400 },
      button: { fontFamily: DISPLAY, letterSpacing: '0.15em', fontWeight: 400 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          a: { color: accent, textDecorationColor: 'currentColor' },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 2, paddingLeft: 16, paddingRight: 16 },
          containedPrimary: {
            color: COLORS.ink,
            backgroundColor: COLORS.gold,
            boxShadow: 'none',
            '&:hover': { backgroundColor: COLORS.goldLight, boxShadow: 'none' },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: COLORS.ink,
            color: COLORS.cream,
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: `1px solid ${COLORS.line}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontFamily: DISPLAY,
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 2 } } },
      RaMenuItemLink: {
        styleOverrides: {
          root: {
            borderLeft: '3px solid transparent',
            '&.RaMenuItemLink-active': {
              borderLeftColor: accent,
              color: accent,
              '& .RaMenuItemLink-icon': { color: accent },
            },
          },
        },
      },
      // nagłówek strony (tytuł listy / formularza) – jak nagłówki na stronie
      RaList: { styleOverrides: { root: { '& .RaList-main': { marginTop: 8 } } } },
    },
  } as RaThemeOptions;
};

export const darkTheme: RaThemeOptions = deepmerge(
  deepmerge(defaultDarkTheme, shared('dark')),
  {
    palette: {
      mode: 'dark',
      primary: { main: COLORS.gold, light: COLORS.goldLight, dark: COLORS.goldDark, contrastText: COLORS.ink },
      secondary: { main: COLORS.stone, contrastText: COLORS.ink },
      // stonowane barwy statusów (np. „Rezerwacja przyjęta”, „Czeka na potwierdzenie”)
      success: { main: '#7f9d63', contrastText: COLORS.ink },
      warning: { main: '#d19a4c', contrastText: COLORS.ink },
      background: { default: COLORS.ink, paper: COLORS.coal },
      text: { primary: COLORS.cream, secondary: COLORS.stone },
      divider: COLORS.line,
    },
    components: {
      RaSidebar: { styleOverrides: { root: { '& .RaSidebar-fixed': { backgroundColor: COLORS.ink } } } },
      // pasek z przyciskiem „Zapisz” pod formularzem
      RaToolbar: { styleOverrides: { root: { backgroundColor: COLORS.graphite } } },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: COLORS.graphite,
            '&:hover': { backgroundColor: COLORS.graphiteLight },
            '&.Mui-focused': { backgroundColor: COLORS.graphite },
          },
        },
      },
    },
  } as RaThemeOptions,
);

export const lightTheme: RaThemeOptions = deepmerge(
  deepmerge(defaultLightTheme, shared('light')),
  {
    palette: {
      mode: 'light',
      primary: { main: COLORS.goldDark, light: COLORS.gold, dark: '#6b5128', contrastText: '#fff' },
      secondary: { main: '#5c574f' },
      success: { main: '#5f7d45' },
      warning: { main: '#b07a2f' },
      background: { default: '#f7f3ec', paper: '#ffffff' },
      text: { primary: COLORS.ink, secondary: '#5c574f' },
    },
  } as RaThemeOptions,
);
