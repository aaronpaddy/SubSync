import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  FormControlLabel,
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email,
  Sms,
  Send,
  History,
  Settings,
  CheckCircle,
  Error,
  Schedule,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext';
import { Notification, NotificationStats } from '../../types';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testNotification, setTestNotification] = useState({
    type: 'email' as 'email' | 'sms',
    message: 'This is a test notification from SubTrackr!',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? false,
    reminderDays: user?.preferences?.reminderDays ?? 3,
  });

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications/history');
      setNotifications(response.data.notifications);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/notifications/stats');
      setStats(response.data);
    } catch (err: any) {
      console.error('Failed to fetch notification stats:', err);
    }
  };

  const handlePreferencesUpdate = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.put('/notifications/preferences', preferences);
      setSuccess('Notification preferences updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.post('/notifications/test', testNotification);
      setSuccess('Test notification sent successfully!');
      setTestDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Email />;
      case 'sms':
        return <Sms />;
      default:
        return <NotificationsIcon />;
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Notification Preferences */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Settings sx={{ mr: 1 }} />
                <Typography variant="h6">Preferences</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.emailNotifications}
                    onChange={(e) =>
                      setPreferences({ ...preferences, emailNotifications: e.target.checked })
                    }
                  />
                }
                label="Email Notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.smsNotifications}
                    onChange={(e) =>
                      setPreferences({ ...preferences, smsNotifications: e.target.checked })
                    }
                  />
                }
                label="SMS Notifications"
              />

              <TextField
                fullWidth
                label="Reminder Days"
                type="number"
                value={preferences.reminderDays}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    reminderDays: parseInt(e.target.value) || 3,
                  })
                }
                sx={{ mt: 2 }}
                helperText="Days before due date to send reminders"
                inputProps={{ min: 1, max: 30 }}
              />

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handlePreferencesUpdate}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={20} /> : 'Update Preferences'}
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setTestDialogOpen(true)}
                  disabled={loading}
                  fullWidth
                  startIcon={<Send />}
                >
                  Send Test Notification
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Statistics */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <History sx={{ mr: 1 }} />
                <Typography variant="h6">Statistics</Typography>
              </Box>

              {stats ? (
                <Grid container spacing={2}>
                  {stats.statusStats.map((stat) => (
                    <Grid item xs={6} sm={3} key={stat._id}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {stat.count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary">No statistics available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notification History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <History sx={{ mr: 1 }} />
                  <Typography variant="h6">Notification History</Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={fetchNotifications}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>

              {notifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No notifications yet
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Scheduled For</TableCell>
                        <TableCell>Sent At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow key={notification._id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getTypeIcon(notification.type)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {notification.type.toUpperCase()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 300 }}>
                              {notification.message}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={notification.status}
                              color={getStatusColor(notification.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {format(new Date(notification.scheduledFor), 'MMM dd, yyyy HH:mm')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {notification.sentAt ? (
                              <Typography variant="body2">
                                {format(new Date(notification.sentAt), 'MMM dd, yyyy HH:mm')}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Test Notification Dialog */}
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Test Notification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={testNotification.type === 'email'}
                    onChange={(e) =>
                      setTestNotification({
                        ...testNotification,
                        type: e.target.checked ? 'email' : 'sms',
                      })
                    }
                  />
                }
                label="Email Notification"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Test Message"
                multiline
                rows={3}
                value={testNotification.message}
                onChange={(e) =>
                  setTestNotification({ ...testNotification, message: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleTestNotification} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Send Test'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notifications; 