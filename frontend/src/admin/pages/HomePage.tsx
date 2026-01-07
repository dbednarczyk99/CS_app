import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{maxWidth: 1000, margin: '40px auto' }}>
      <Card sx={{ padding: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome to the Bakery Admin Panel!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Here you can manage products, categories, locations, contacts, users, and more.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => navigate('/products')}>
              Go to Products
            </Button>
            <Button variant="outlined" onClick={() => navigate('/contact/locations')}>
              Go to Locations
            </Button>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Quick tips:
            </Typography>
            <ul>
              <li>Use the menu on the left to navigate between sections.</li>
              <li>Click "Help" for documentation and support.</li>
              <li>Check "Site settings" to manage users and graphics.</li>
            </ul>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HomePage;