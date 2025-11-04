import Subscription from '../models/subscriptionModel.js';

// @desc    Subscribe to newsletter
// @route   POST /api/subscriptions
// @access  Public
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email });

    if (existingSubscription) {
      // If already subscribed and active
      if (existingSubscription.isActive) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter',
          data: existingSubscription,
        });
      }

      // If previously unsubscribed, reactivate
      existingSubscription.isActive = true;
      existingSubscription.subscribedAt = Date.now();
      existingSubscription.unsubscribedAt = undefined;
      await existingSubscription.save();

      return res.status(200).json({
        success: true,
        message: 'Welcome back! You have been resubscribed to our newsletter',
        data: existingSubscription,
      });
    }

    // Create new subscription
    const subscription = await Subscription.create({
      email,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter',
      data: subscription,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error subscribing to newsletter',
      error: error.message,
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/subscriptions/unsubscribe
// @access  Public
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const subscription = await Subscription.findOne({ email });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our subscription list',
      });
    }

    if (!subscription.isActive) {
      return res.status(200).json({
        success: true,
        message: 'You are already unsubscribed',
      });
    }

    subscription.isActive = false;
    subscription.unsubscribedAt = Date.now();
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from our newsletter',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unsubscribing from newsletter',
      error: error.message,
    });
  }
};

// @desc    Get all subscriptions (with pagination)
// @route   GET /api/subscriptions
// @access  Public
export const getAllSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true';
    }

    const subscriptions = await Subscription.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Subscription.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions',
      error: error.message,
    });
  }
};

// @desc    Get subscription by email
// @route   GET /api/subscriptions/:email
// @access  Public
export const getSubscriptionByEmail = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ email: req.params.email });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message,
    });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:email
// @access  Public
export const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({ email: req.params.email });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subscription',
      error: error.message,
    });
  }
};
