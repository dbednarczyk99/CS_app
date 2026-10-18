import { LoginForm } from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { COLORS } from '../../theme';

/** Logowanie w stylu strony: zdjęcie z piekarni w tle, logo, złoty akcent; zawsze ciemne */
export const LoginPage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      p: 2,
      background: `linear-gradient(rgba(20, 22, 24, 0.78), rgba(20, 22, 24, 0.94)), url(/logowanie.jpg) center / cover no-repeat`,
      backgroundColor: COLORS.ink,
    }}
  >
    <Card
      elevation={0}
      sx={{
        width: 'min(420px, 100%)',
        bgcolor: 'rgba(26, 29, 32, 0.92)',
        backdropFilter: 'blur(6px)',
        border: `1px solid ${COLORS.line}`,
        borderTop: `2px solid ${COLORS.gold}`,
        color: COLORS.cream,
      }}
    >
      <CardContent sx={{ px: { xs: 3, sm: 5 }, pt: 5, pb: 3 }}>
        <Box component="img" src="/logo-poziome-biale.png" alt="Chleba Smak" sx={{ display: 'block', width: 210, mb: 4 }} />
        <Typography variant="overline" sx={{ color: COLORS.gold, display: 'block', lineHeight: 1.6 }}>
          Panel administracyjny
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.5, mb: 1 }}>
          Zaloguj się
        </Typography>
        <Box sx={{ width: 48, height: 2, bgcolor: COLORS.gold, mb: 1 }} />
      </CardContent>
      {/* formularz react-admina: login, hasło, przycisk; komunikaty błędów po polsku (i18n) */}
      <Box
        sx={{
          px: { xs: 1, sm: 3 },
          pb: 3,
          '& .MuiCardContent-root': { pt: 0 },
          '& .MuiButton-root': { mt: 1, py: 1.25 },
        }}
      >
        <LoginForm />
      </Box>
    </Card>
    <Typography variant="caption" sx={{ color: COLORS.stone, textAlign: 'center' }}>
      Dostęp tylko dla obsługi piekarni Chleba Smak
    </Typography>
  </Box>
);
