import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GlobalBackground from '@/components/common/GlobalBackground';
import { GradientTitle } from '@/components/common/GradientTitle';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加表单提交逻辑
    setOpenSnackbar(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: 'Email',
      content: 'support@pandaquant.com',
      link: 'mailto:support@pandaquant.com'
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <LocationOnIcon />,
      title: 'Location',
      content: 'Global Headquarters',
      link: 'https://maps.google.com'
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Business Hours',
      content: 'Monday - Friday, 9:00 AM - 6:00 PM (UTC)',
      link: null
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <GradientTitle variant="h3" sx={{ mb: 2 }}>
            Contact Us
          </GradientTitle>
          <Typography variant="h6" color="text.secondary">
            Get technical support or business cooperation
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* 联系表单 */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Send Message
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                          },
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* 联系信息 */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Contact Information
                </Typography>
                <List>
                  {contactInfo.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        component={motion.div}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ListItemIcon sx={{ color: 'primary.main' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={
                            item.link ? (
                              <Typography
                                component="a"
                                href={item.link}
                                sx={{
                                  color: 'primary.main',
                                  textDecoration: 'none',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                {item.content}
                              </Typography>
                            ) : (
                              item.content
                            )
                          }
                        />
                      </ListItem>
                      {index < contactInfo.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Your message has been sent. We will get back to you soon!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage; 