// User types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    reminderDays: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export interface Subscription {
  _id: string;
  user: string;
  name: string;
  category: SubscriptionCategory;
  description?: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  trialEndDate?: string;
  isActive: boolean;
  autoRenew: boolean;
  website?: string;
  accountEmail?: string;
  notes?: string;
  tags: string[];
  paymentMethod?: string;
  lastPaymentDate?: string;
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionCategory = 
  | 'streaming'
  | 'music'
  | 'software'
  | 'gaming'
  | 'fitness'
  | 'education'
  | 'utilities'
  | 'rent'
  | 'insurance'
  | 'membership'
  | 'other';

export type BillingCycle = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// Notification types
export interface Notification {
  _id: string;
  user: string;
  subscription: string;
  type: 'email' | 'sms' | 'push';
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  message: string;
  scheduledFor: string;
  sentAt?: string;
  error?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

// Statistics types
export interface SubscriptionStats {
  overview: {
    totalMonthly: number;
    totalYearly: number;
    count: number;
  };
  categoryStats: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  upcomingRenewals: Subscription[];
}

export interface NotificationStats {
  statusStats: Array<{
    _id: string;
    count: number;
  }>;
  typeStats: Array<{
    _id: string;
    count: number;
    sent: number;
    failed: number;
  }>;
}

export interface AIAnalysis {
  totalSpending: number;
  monthlySpending: number;
  yearlySpending: number;
  categories: {
    [key: string]: {
      count: number;
      totalMonthly: number;
      subscriptions: Subscription[];
    };
  };
  insights: Array<{
    type: 'warning' | 'success' | 'info';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  recommendations: Array<{
    type: 'optimization' | 'review' | 'savings';
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

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface SubscriptionFormData {
  name: string;
  category: SubscriptionCategory;
  description?: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  nextBillingDate: Date;
  trialEndDate?: Date;
  isActive: boolean;
  autoRenew: boolean;
  website?: string;
  accountEmail?: string;
  notes?: string;
  tags: string[];
  paymentMethod?: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  reminderDays: number;
}

// Filter and search types
export interface SubscriptionFilters {
  category?: SubscriptionCategory;
  isActive?: boolean;
  search?: string;
  sortBy?: keyof Subscription;
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationFilters {
  status?: Notification['status'];
  type?: Notification['type'];
  page?: number;
  limit?: number;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlySpendingData {
  month: string;
  amount: number;
}

export interface CategorySpendingData {
  category: SubscriptionCategory;
  amount: number;
  count: number;
  percentage: number;
} 