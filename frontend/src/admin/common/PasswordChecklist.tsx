import { Box, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { PASSWORD_RULES } from './password-rules';

/** Lista wymagań pod polem nowego hasła – spełnione odhaczają się na bieżąco */
export function PasswordChecklist({ password }: { password: string }) {
  return (
    <Stack component="ul" spacing={0.25} sx={{ listStyle: 'none', p: 0, m: '4px 0 8px' }} aria-label="Wymagania hasła">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <Box component="li" key={rule.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {ok ? (
              <CheckCircleIcon sx={{ fontSize: 16 }} color="success" />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 16, opacity: 0.6 }} />
            )}
            <Typography variant="caption" color={ok ? 'success.main' : 'text.secondary'}>
              {rule.label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
