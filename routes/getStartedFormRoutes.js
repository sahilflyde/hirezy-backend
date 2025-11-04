import express from 'express';
import {
  startForm,
  updateStep1,
  updateStep2,
  updateStep3,
  updateStep4,
  updateStep5,
  getFormById,
  getAllForms,
  deleteForm,
} from '../controllers/getStartedFormController.js';

const router = express.Router();

// Start a new form or get existing
router.post('/start', startForm);

// Update individual steps
router.put('/:id/step1', updateStep1);
router.put('/:id/step2', updateStep2);
router.put('/:id/step3', updateStep3);
router.put('/:id/step4', updateStep4);
router.put('/:id/step5', updateStep5);

// Get form(s)
router.get('/', getAllForms);
router.get('/:id', getFormById);

// Delete form
router.delete('/:id', deleteForm);

export default router;
