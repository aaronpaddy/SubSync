import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Chip,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../contexts/AuthContext';
import { SubscriptionFormData, SubscriptionCategory, BillingCycle } from '../../types';

const categories: SubscriptionCategory[] = [
  'streaming',
  'music',
  'software',
  'gaming',
  'fitness',
  'education',
  'utilities',
  'rent',
  'insurance',
  'membership',
  'other',
];

const billingCycles: BillingCycle[] = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

const SubscriptionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    category: 'other',
    description: '',
    amount: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: new Date(),
    trialEndDate: undefined,
    isActive: true,
    autoRenew: true,
    website: '',
    accountEmail: '',
    notes: '',
    tags: [],
    paymentMethod: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchSubscription();
    }
  }, [id]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/subscriptions/${id}`);
      const subscription = response.data.subscription;
      
      setFormData({
        name: subscription.name,
        category: subscription.category,
        description: subscription.description || '',
        amount: subscription.amount,
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        nextBillingDate: new Date(subscription.nextBillingDate),
        trialEndDate: subscription.trialEndDate ? new Date(subscription.trialEndDate) : undefined,
        isActive: subscription.isActive,
        autoRenew: subscription.autoRenew,
        website: subscription.website || '',
        accountEmail: subscription.accountEmail || '',
        notes: subscription.notes || '',
        tags: subscription.tags || [],
        paymentMethod: subscription.paymentMethod || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        nextBillingDate: formData.nextBillingDate.toISOString(),
        trialEndDate: formData.trialEndDate?.toISOString(),
      };

      if (isEditing) {
        await api.put(`/subscriptions/${id}`, submitData);
      } else {
        await api.post('/subscriptions', submitData);
      }

      navigate('/subscriptions');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SubscriptionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  if (loading && isEditing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEditing ? 'Edit Subscription' : 'Add New Subscription'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subscription Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Billing Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Billing Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    label="Currency"
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                    <MenuItem value="CAD">CAD (C$)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Billing Cycle</InputLabel>
                  <Select
                    value={formData.billingCycle}
                    onChange={(e) => handleChange('billingCycle', e.target.value)}
                    label="Billing Cycle"
                  >
                    {billingCycles.map((cycle) => (
                      <MenuItem key={cycle} value={cycle}>
                        {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Next Billing Date"
                  value={formData.nextBillingDate}
                  onChange={(date) => handleChange('nextBillingDate', date || new Date())}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Trial End Date (Optional)"
                  value={formData.trialEndDate}
                  onChange={(date) => handleChange('trialEndDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              {/* Settings */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Settings
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                    />
                  }
                  label="Active Subscription"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.autoRenew}
                      onChange={(e) => handleChange('autoRenew', e.target.checked)}
                    />
                  }
                  label="Auto Renew"
                />
              </Grid>

              {/* Additional Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website (Optional)"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Email (Optional)"
                  type="email"
                  value={formData.accountEmail}
                  onChange={(e) => handleChange('accountEmail', e.target.value)}
                  placeholder="account@example.com"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Method (Optional)"
                  value={formData.paymentMethod}
                  onChange={(e) => handleChange('paymentMethod', e.target.value)}
                  placeholder="Credit Card, PayPal, etc."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <TextField
                    fullWidth
                    label="Add Tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Press Enter to add"
                  />
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Additional notes about this subscription..."
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/subscriptions')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : (isEditing ? 'Update' : 'Create')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubscriptionForm; 