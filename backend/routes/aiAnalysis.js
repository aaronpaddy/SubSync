const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const SubscriptionAnalyzer = require('../utils/aiAnalysis');

// Get comprehensive AI analysis
router.get('/analysis', auth, async (req, res) => {
  try {
    const analyzer = new SubscriptionAnalyzer(req.user.id);
    const analysis = await analyzer.analyzeSubscriptions();
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate analysis'
    });
  }
});

// Get spending insights
router.get('/insights', auth, async (req, res) => {
  try {
    const analyzer = new SubscriptionAnalyzer(req.user.id);
    const analysis = await analyzer.analyzeSubscriptions();
    
    res.json({
      success: true,
      insights: analysis.insights,
      healthScore: analysis.healthScore
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights'
    });
  }
});

// Get optimization recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const analyzer = new SubscriptionAnalyzer(req.user.id);
    const analysis = await analyzer.analyzeSubscriptions();
    
    res.json({
      success: true,
      recommendations: analysis.recommendations,
      savingsOpportunities: analysis.savingsOpportunities
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// Get category analysis
router.get('/categories', auth, async (req, res) => {
  try {
    const analyzer = new SubscriptionAnalyzer(req.user.id);
    const analysis = await analyzer.analyzeSubscriptions();
    
    res.json({
      success: true,
      categories: analysis.categories,
      monthlySpending: analysis.monthlySpending,
      yearlySpending: analysis.yearlySpending
    });
  } catch (error) {
    console.error('Category analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze categories'
    });
  }
});

// Get health score and summary
router.get('/health', auth, async (req, res) => {
  try {
    const analyzer = new SubscriptionAnalyzer(req.user.id);
    const analysis = await analyzer.analyzeSubscriptions();
    
    const healthSummary = {
      score: analysis.healthScore,
      level: analysis.healthScore >= 80 ? 'excellent' : 
             analysis.healthScore >= 60 ? 'good' : 
             analysis.healthScore >= 40 ? 'fair' : 'poor',
      monthlySpending: analysis.monthlySpending,
      yearlySpending: analysis.yearlySpending,
      activeSubscriptions: Object.values(analysis.categories).reduce((total, cat) => total + cat.count, 0),
      topCategory: Object.entries(analysis.categories)
        .sort(([,a], [,b]) => b.totalMonthly - a.totalMonthly)[0]?.[0] || 'none'
    };
    
    res.json({
      success: true,
      health: healthSummary
    });
  } catch (error) {
    console.error('Health analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate health analysis'
    });
  }
});

// Get savings opportunities
router.get('/savings', auth, async (req, res) => {
  try {
    const analyzer = new SubscriptionAnalyzer(req.user.id);
    const analysis = await analyzer.analyzeSubscriptions();
    
    const totalPotentialSavings = analysis.recommendations.reduce((total, rec) => 
      total + rec.potentialSavings, 0
    ) + analysis.savingsOpportunities.reduce((total, opp) => 
      total + opp.potentialSavings, 0
    );
    
    res.json({
      success: true,
      opportunities: analysis.savingsOpportunities,
      recommendations: analysis.recommendations,
      totalPotentialSavings,
      monthlySpending: analysis.monthlySpending,
      potentialSavingsPercentage: ((totalPotentialSavings / analysis.monthlySpending) * 100).toFixed(1)
    });
  } catch (error) {
    console.error('Savings analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate savings analysis'
    });
  }
});

module.exports = router; 