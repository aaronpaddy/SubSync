const Subscription = require('../models/Subscription');

// AI Analysis Utilities
class SubscriptionAnalyzer {
  constructor(userId) {
    this.userId = userId;
  }

  // Get all user subscriptions with analysis
  async analyzeSubscriptions() {
    const subscriptions = await Subscription.find({ user: this.userId });
    
    if (subscriptions.length === 0) {
      return {
        totalSpending: 0,
        monthlySpending: 0,
        yearlySpending: 0,
        categories: {},
        insights: [],
        recommendations: [],
        healthScore: 100,
        savingsOpportunities: []
      };
    }

    const analysis = {
      totalSpending: this.calculateTotalSpending(subscriptions),
      monthlySpending: this.calculateMonthlySpending(subscriptions),
      yearlySpending: this.calculateYearlySpending(subscriptions),
      categories: this.analyzeCategories(subscriptions),
      insights: await this.generateInsights(subscriptions),
      recommendations: await this.generateRecommendations(subscriptions),
      healthScore: this.calculateHealthScore(subscriptions),
      savingsOpportunities: await this.findSavingsOpportunities(subscriptions)
    };

    return analysis;
  }

  // Calculate total spending
  calculateTotalSpending(subscriptions) {
    return subscriptions.reduce((total, sub) => {
      if (sub.isActive) {
        return total + (sub.amount * this.getBillingCycleMultiplier(sub.billingCycle));
      }
      return total;
    }, 0);
  }

  // Calculate monthly spending
  calculateMonthlySpending(subscriptions) {
    return subscriptions.reduce((total, sub) => {
      if (sub.isActive) {
        const monthlyAmount = this.convertToMonthly(sub.amount, sub.billingCycle);
        return total + monthlyAmount;
      }
      return total;
    }, 0);
  }

  // Calculate yearly spending
  calculateYearlySpending(subscriptions) {
    return subscriptions.reduce((total, sub) => {
      if (sub.isActive) {
        const yearlyAmount = this.convertToYearly(sub.amount, sub.billingCycle);
        return total + yearlyAmount;
      }
      return total;
    }, 0);
  }

  // Analyze spending by category
  analyzeCategories(subscriptions) {
    const categories = {};
    
    subscriptions.forEach(sub => {
      if (sub.isActive) {
        const monthlyAmount = this.convertToMonthly(sub.amount, sub.billingCycle);
        
        if (!categories[sub.category]) {
          categories[sub.category] = {
            count: 0,
            totalMonthly: 0,
            subscriptions: []
          };
        }
        
        categories[sub.category].count++;
        categories[sub.category].totalMonthly += monthlyAmount;
        categories[sub.category].subscriptions.push(sub);
      }
    });

    return categories;
  }

  // Generate AI insights
  async generateInsights(subscriptions) {
    const insights = [];
    const monthlySpending = this.calculateMonthlySpending(subscriptions);
    const categories = this.analyzeCategories(subscriptions);

    // High spending insight
    if (monthlySpending > 100) {
      insights.push({
        type: 'warning',
        title: 'High Monthly Spending',
        message: `You're spending $${monthlySpending.toFixed(2)} monthly on subscriptions. Consider reviewing your highest-cost services.`,
        priority: 'high'
      });
    }

    // Category concentration insight
    const topCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b.totalMonthly - a.totalMonthly)[0];
    
    if (topCategory && topCategory[1].totalMonthly > monthlySpending * 0.5) {
      insights.push({
        type: 'info',
        title: 'Category Concentration',
        message: `${topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)} services make up ${((topCategory[1].totalMonthly / monthlySpending) * 100).toFixed(1)}% of your spending.`,
        priority: 'medium'
      });
    }

    // Trial period insights
    const trials = subscriptions.filter(sub => sub.trialEndDate && new Date(sub.trialEndDate) > new Date());
    if (trials.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Active Trial Periods',
        message: `You have ${trials.length} subscription(s) in trial period. Set reminders to avoid unexpected charges.`,
        priority: 'high'
      });
    }

    // Inactive subscriptions
    const inactive = subscriptions.filter(sub => !sub.isActive);
    if (inactive.length > 0) {
      insights.push({
        type: 'success',
        title: 'Inactive Subscriptions',
        message: `You have ${inactive.length} inactive subscription(s). Consider removing them to clean up your list.`,
        priority: 'low'
      });
    }

    return insights;
  }

  // Generate AI recommendations
  async generateRecommendations(subscriptions) {
    const recommendations = [];
    const categories = this.analyzeCategories(subscriptions);

    // Streaming service recommendations
    const streamingServices = categories.streaming?.subscriptions || [];
    if (streamingServices.length > 2) {
      const totalStreaming = categories.streaming.totalMonthly;
      recommendations.push({
        type: 'optimization',
        title: 'Streaming Service Consolidation',
        message: `You have ${streamingServices.length} streaming services costing $${totalStreaming.toFixed(2)}/month. Consider rotating services or using family plans.`,
        potentialSavings: totalStreaming * 0.3,
        action: 'review_streaming'
      });
    }

    // High-cost subscription recommendations
    const highCostSubs = subscriptions.filter(sub => 
      sub.isActive && this.convertToMonthly(sub.amount, sub.billingCycle) > 20
    );
    
    highCostSubs.forEach(sub => {
      const monthlyCost = this.convertToMonthly(sub.amount, sub.billingCycle);
      recommendations.push({
        type: 'review',
        title: `Review ${sub.name}`,
        message: `${sub.name} costs $${monthlyCost.toFixed(2)}/month. Consider if you're getting full value.`,
        potentialSavings: monthlyCost * 0.5,
        action: 'review_subscription',
        subscriptionId: sub._id
      });
    });

    // Annual vs monthly savings
    const monthlySubs = subscriptions.filter(sub => 
      sub.isActive && sub.billingCycle === 'monthly' && sub.amount > 10
    );
    
    monthlySubs.forEach(sub => {
      const annualSavings = sub.amount * 0.2; // Assuming 20% annual discount
      recommendations.push({
        type: 'savings',
        title: `Annual Plan for ${sub.name}`,
        message: `Switch to annual billing for ${sub.name} to save ~$${annualSavings.toFixed(2)}/year.`,
        potentialSavings: annualSavings,
        action: 'switch_to_annual',
        subscriptionId: sub._id
      });
    });

    return recommendations;
  }

  // Calculate subscription health score
  calculateHealthScore(subscriptions) {
    let score = 100;
    const activeSubs = subscriptions.filter(sub => sub.isActive);
    
    // Deduct points for high spending
    const monthlySpending = this.calculateMonthlySpending(activeSubs);
    if (monthlySpending > 100) score -= 20;
    if (monthlySpending > 200) score -= 20;
    
    // Deduct points for too many subscriptions
    if (activeSubs.length > 10) score -= 15;
    if (activeSubs.length > 15) score -= 15;
    
    // Deduct points for category concentration
    const categories = this.analyzeCategories(activeSubs);
    const categoryCount = Object.keys(categories).length;
    if (categoryCount < 3) score -= 10;
    
    // Add points for good practices
    const hasTrials = subscriptions.some(sub => sub.trialEndDate);
    if (hasTrials) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  // Find savings opportunities
  async findSavingsOpportunities(subscriptions) {
    const opportunities = [];
    const activeSubs = subscriptions.filter(sub => sub.isActive);
    
    // Duplicate service detection
    const serviceNames = activeSubs.map(sub => sub.name.toLowerCase());
    const duplicates = serviceNames.filter((name, index) => 
      serviceNames.indexOf(name) !== index
    );
    
    if (duplicates.length > 0) {
      opportunities.push({
        type: 'duplicate',
        title: 'Potential Duplicate Services',
        message: `Found potential duplicate services. Review and cancel unused ones.`,
        potentialSavings: 15, // Estimated savings
        action: 'review_duplicates'
      });
    }

    // High-cost opportunities
    const highCostSubs = activeSubs.filter(sub => 
      this.convertToMonthly(sub.amount, sub.billingCycle) > 30
    );
    
    highCostSubs.forEach(sub => {
      const monthlyCost = this.convertToMonthly(sub.amount, sub.billingCycle);
      opportunities.push({
        type: 'high_cost',
        title: `High-Cost Service: ${sub.name}`,
        message: `${sub.name} costs $${monthlyCost.toFixed(2)}/month. Look for alternatives or negotiate.`,
        potentialSavings: monthlyCost * 0.4,
        action: 'review_high_cost',
        subscriptionId: sub._id
      });
    });

    return opportunities;
  }

  // Utility methods
  getBillingCycleMultiplier(cycle) {
    const multipliers = {
      daily: 365,
      weekly: 52,
      monthly: 12,
      quarterly: 4,
      yearly: 1
    };
    return multipliers[cycle] || 12;
  }

  convertToMonthly(amount, cycle) {
    const multipliers = {
      daily: 30.44,
      weekly: 4.33,
      monthly: 1,
      quarterly: 0.33,
      yearly: 0.083
    };
    return amount * (multipliers[cycle] || 1);
  }

  convertToYearly(amount, cycle) {
    const multipliers = {
      daily: 365,
      weekly: 52,
      monthly: 12,
      quarterly: 4,
      yearly: 1
    };
    return amount * (multipliers[cycle] || 12);
  }
}

module.exports = SubscriptionAnalyzer; 