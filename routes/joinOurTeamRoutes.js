import express from 'express';
import {
  startJoinTeamForm,
  updateStep1,
  updateStep2,
  updateStep3,
  updateStep4,
  updateStep5,
  getFormById,
  getAllForms,
  deleteForm,
} from '../controllers/joinOurTeamController.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Start a new form
router.post('/start', startJoinTeamForm);

// Update individual steps
router.put('/:id/step1', updateStep1);
router.put('/:id/step2', uploadResume.single('resume'), updateStep2);
router.put('/:id/step3', updateStep3);
router.put('/:id/step4', updateStep4);
router.put('/:id/step5', updateStep5);

// Get form(s)
router.get('/', getAllForms);
router.get('/:id', getFormById);

// Delete form
router.delete('/:id', deleteForm);

export default router;
