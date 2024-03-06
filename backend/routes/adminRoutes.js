// Import necessary modules and models
import express from 'express';
import { getUsers, deleteUser, getAllUsersGoals, deletePost, getAllEmissions } from '../controllers/adminControllers.js';
import {authenticateAdmin} from '../middleware/error.js';


const router = express.Router();

router.route('/users').get(authenticateAdmin, getUsers);
router.delete('/users/:id', authenticateAdmin, deleteUser);
router.route('/goals').get(authenticateAdmin, getAllUsersGoals);
router.route('/posts/:postId').delete(authenticateAdmin, deletePost);
router.route('/emissions').get(authenticateAdmin, getAllEmissions);

export default router;
