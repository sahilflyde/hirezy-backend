import express from 'express';
import {
    register,
    login,
    adminLogin,
    refreshToken,
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    deleteUser,
    forgotPassword,
    verifyOTP,
    resetPassword
} from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/refresh-token', refreshToken);

// Forgot Password routes (Public)
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

// Admin routes
router.get('/users',getAllUsers);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

export default router;
