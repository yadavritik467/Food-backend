// controllers/analyticsController.js
import ua from "universal-analytics"
// const ua = require('');

 const trackPageView = (req, res, next) => {
  const visitor = ua('YOUR_TRACKING_ID', { uid: req.user ? req.user._id : 'anonymous' });

  // Track page views
  visitor.pageview(req.originalUrl, (err) => {
    if (err) {
      console.error('Error tracking page view:', err);
    }
  });

  next();
};

export default  trackPageView

// You can add more controller functions to track other events if needed
// For example, you can add a function to track form submissions, button clicks, etc.
