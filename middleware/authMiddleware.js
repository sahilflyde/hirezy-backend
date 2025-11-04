import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'gtw-secret-key-2024', async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: err.name === 'TokenExpiredError' 
                        ? 'Token has expired' 
                        : 'Invalid token'
                });
            }

            // Check if user still exists and is active
            const user = await User.findById(decoded.id);
            if (!user || !user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'User not found or inactive'
                });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            req.user = null;
            return next();
        }

        jwt.verify(token, process.env.JWT_SECRET || 'gtw-secret-key-2024', async (err, decoded) => {
            if (err) {
                req.user = null;
            } else {
                const user = await User.findById(decoded.id);
                req.user = user && user.isActive ? decoded : null;
            }
            next();
        });
    } catch (error) {
        req.user = null;
        next();
    }
};
