import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Notifications,
  Warning,
  CalendarToday,
  AttachMoney,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { api } from '../../contexts/AuthContext';
import { SubscriptionStats, Subscription } from '../../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscriptions/stats/overview');
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      streaming: '#FF6B6B',
      music: '#4ECDC4',
      software: '#45B7D1',
      gaming: '#96CEB4',
      fitness: '#FFEAA7',
      education: '#DDA0DD',
      utilities: '#98D8C8',
      rent: '#F7DC6F',
      insurance: '#BB8FCE',
      membership: '#85C1E9',
      other: '#AEB6BF',
    };
    return colorMap[category] || '#AEB6BF';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Monthly Spending</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats ? formatCurrency(stats.overview.totalMonthly) : '$0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats?.overview.count || 0} active subscriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Annual Spending</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats ? formatCurrency(stats.overview.totalYearly) : '$0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total yearly cost
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Due Soon</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {stats?.upcomingRenewals?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Active</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {stats?.overview.count || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active subscriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Spending by Category
              </Typography>
              {stats?.categoryStats && stats.categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalAmount"
                    >
                      {stats.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry._id)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Renewals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Renewals
              </Typography>
              {stats?.upcomingRenewals && stats.upcomingRenewals.length > 0 ? (
                <List>
                  {stats.upcomingRenewals.slice(0, 5).map((subscription) => (
                    <ListItem key={subscription._id} divider>
                      <ListItemIcon>
                        <AttachMoney color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={subscription.name}
                        secondary={`${formatCurrency(subscription.amount)} - ${format(
                          new Date(subscription.nextBillingDate),
                          'MMM dd, yyyy'
                        )}`}
                      />
                      <Chip
                        label={subscription.category}
                        size="small"
                        sx={{ backgroundColor: getCategoryColor(subscription.category), color: 'white' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <Typography color="text.secondary">No upcoming renewals</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 