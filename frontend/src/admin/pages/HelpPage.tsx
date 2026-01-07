import { Card, CardContent, Typography, Box, Link, Divider } from '@mui/material';

const HelpPage = () => (
  <Box sx={{ maxWidth: 1000, margin: '40px auto' }}>
    <Card sx={{ padding: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Help & Support
        </Typography>
        <Typography variant="body1" gutterBottom>
          Here you will find answers to the most common questions and useful links for using the Bakery Admin Panel.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <ul>
          <li>
            <strong>How do I add a new product?</strong>
            <br />
            Go to <b>Products</b> in the menu and click "Create".
          </li>
          <li>
            <strong>How do I edit opening hours?</strong>
            <br />
            Go to <b>Locations</b>, select a location, and edit the hours for each day.
          </li>
          <li>
            <strong>How do I reset my password?</strong>
            <br />
            Contact your administrator or use the password reset option on the login page (if available).
          </li>
        </ul>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Useful Links
        </Typography>
        <ul>
          <li>
            <Link href="https://mui.com/" target="_blank" rel="noopener">
              Material-UI Documentation
            </Link>
          </li>
          <li>
            <Link href="https://marmelab.com/react-admin/" target="_blank" rel="noopener">
              React-Admin Documentation
            </Link>
          </li>
          <li>
            <Link href="mailto:support@yourbakery.com">
              Contact Support: support@yourbakery.com
            </Link>
          </li>
        </ul>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          If you need further help, contact your administrator or write to us at <b>support@yourbakery.com</b>.
        </Typography>
      </CardContent>
    </Card>
  </Box>
);

export default HelpPage;