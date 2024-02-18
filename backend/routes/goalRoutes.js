// Import necessary modules and models
import express from 'express';
import { createGoal, getGoals, getGoalById, updateGoal, deleteGoal } from '../controllers/goalControllers.js';
import {authenticateUser} from '../middleware/error.js';

// Create a router instance
const router = express.Router();

// Define routes for CRUD operations
router.get('/', authenticateUser, getGoals);
router.post('/add', authenticateUser, createGoal);
router.get('/:id', authenticateUser, getGoalById);
router.put('/:id', authenticateUser, updateGoal);
router.delete('/:id', authenticateUser, deleteGoal);

// Export the router
export default router;
