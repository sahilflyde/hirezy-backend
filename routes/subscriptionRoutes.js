import express from 'express';
import {
  subscribe,
  unsubscribe,
  getAllSubscriptions,
  getSubscriptionByEmail,
  deleteSubscription,
} from '../controllers/subscriptionController.js';

const router = express.Router();

// Public routes
router.post('/', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/', getAllSubscriptions);
router.get('/:email', getSubscriptionByEmail);
router.delete('/:email', deleteSubscription);

export default router;
