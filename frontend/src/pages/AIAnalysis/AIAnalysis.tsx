import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Savings,
  HealthAndSafety,
  Analytics,
  Warning,
  CheckCircle,
  Info,
  ExpandMore,
  AttachMoney,
  Category,
  Timeline,
} from '@mui/icons-material';
import { api } from '../../contexts/AuthContext';

interface AIAnalysis {
  totalSpending: number;
  monthlySpending: number;
  yearlySpending: number;
  categories: any;
  insights: Array<{
    type: string;
    title: string;
    message: string;
    priority: string;
  }>;
  recommendations: Array<{
    type: string;
    title: string;
    message: string;
    potentialSavings: number;
    action: string;
    subscriptionId?: string;
  }>;
  healthScore: number;
  savingsOpportunities: Array<{
    type: string;
    title: string;
    message: string;
    potentialSavings: number;
    action: string;
    subscriptionId?: string;
  }>;
}

const AIAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ai/analysis');
      setAnalysis(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch AI analysis');
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

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <Warning color="warning" />;
      case 'success':
        return <CheckCircle color="success" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Info />;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp color="primary" />;
      case 'review':
        return <Analytics color="warning" />;
      case 'savings':
        return <Savings color="success" />;
      default:
        return <Lightbulb />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!analysis) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          AI Analysis
        </Typography>
        <Alert severity="error">
          {error || 'Failed to load analysis'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🤖 AI Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Smart insights and recommendations for your subscription portfolio
      </Typography>

      <Grid container spacing={3}>
        {/* Health Score Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HealthAndSafety sx={{ mr: 1 }} />
                <Typography variant="h6">Health Score</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h2" color={getHealthColor(analysis.healthScore)}>
                  {analysis.healthScore}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {getHealthLabel(analysis.healthScore)}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={analysis.healthScore}
                color={getHealthColor(analysis.healthScore)}
                sx={{ height: 8, borderRadius: 4 }}
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Monthly Spending: {formatCurrency(analysis.monthlySpending)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yearly Spending: {formatCurrency(analysis.yearlySpending)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Spending Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1 }} />
                <Typography variant="h6">Spending Overview</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatCurrency(analysis.monthlySpending)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monthly
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatCurrency(analysis.yearlySpending)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Yearly
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {Object.keys(analysis.categories).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categories
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {Object.values(analysis.categories).reduce((total: number, cat: any) => total + cat.count, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Subs
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Lightbulb sx={{ mr: 1 }} />
                <Typography variant="h6">AI Insights</Typography>
              </Box>

              {analysis.insights.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No insights available yet. Add more subscriptions to get personalized insights.
                </Typography>
              ) : (
                <List>
                  {analysis.insights.map((insight, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getInsightIcon(insight.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={insight.title}
                          secondary={insight.message}
                        />
                        <Chip
                          label={insight.priority}
                          size="small"
                          color={insight.priority === 'high' ? 'error' : 
                                 insight.priority === 'medium' ? 'warning' : 'default'}
                        />
                      </ListItem>
                      {index < analysis.insights.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Optimization Recommendations</Typography>
              </Box>

              {analysis.recommendations.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Great job! No optimization recommendations at this time.
                </Typography>
              ) : (
                <List>
                  {analysis.recommendations.map((rec, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getRecommendationIcon(rec.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={rec.title}
                          secondary={
                            <Box>
                              <Typography variant="body2">{rec.message}</Typography>
                              <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                                Potential savings: {formatCurrency(rec.potentialSavings)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < analysis.recommendations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Analysis */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Category sx={{ mr: 1 }} />
                <Typography variant="h6">Category Analysis</Typography>
              </Box>

              {Object.keys(analysis.categories).length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No categories to analyze yet.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {Object.entries(analysis.categories).map(([category, data]: [string, any]) => (
                    <Grid item xs={12} sm={6} md={4} key={category}>
                      <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                            {category}
                          </Typography>
                          <Chip label={data.count} size="small" />
                        </Box>
                        <Typography variant="h5" color="primary">
                          {formatCurrency(data.totalMonthly)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per month
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Savings Opportunities */}
        {analysis.savingsOpportunities.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Savings sx={{ mr: 1 }} />
                  <Typography variant="h6">Savings Opportunities</Typography>
                </Box>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="success.main">
                      Potential Savings: {formatCurrency(
                        analysis.savingsOpportunities.reduce((total, opp) => total + opp.potentialSavings, 0)
                      )}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {analysis.savingsOpportunities.map((opportunity, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemIcon>
                              <Savings color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary={opportunity.title}
                              secondary={
                                <Box>
                                  <Typography variant="body2">{opportunity.message}</Typography>
                                  <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                                    Potential savings: {formatCurrency(opportunity.potentialSavings)}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < analysis.savingsOpportunities.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={fetchAnalysis}
          disabled={loading}
        >
          Refresh Analysis
        </Button>
      </Box>
    </Box>
  );
};

export default AIAnalysis; 