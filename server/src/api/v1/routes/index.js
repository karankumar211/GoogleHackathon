import { Router } from 'express';
import userRouter from './user.routes.js';
import transactionRouter from './transaction.routes.js';
import aiRouter from './ai.routes.js';
import alertRouter from './alert.routes.js';
import verificationRouter from './verification.routes.js';

const router = Router();

// Mounts the user-related routes (e.g., /users/register, /users/login)
router.use('/users', userRouter);

// Mounts the transaction-related routes (e.g., /transactions, /transactions/sms)
router.use('/transactions', transactionRouter);

// Mounts the AI coach routes (e.g., /ai/ask)
router.use('/ai', aiRouter);

// Mounts the alert routes (e.g., /alerts, /alerts/:id/read)
router.use('/alerts', alertRouter);

// Mounts the link verification routes (e.g., /verify/link)
router.use('/verify', verificationRouter);

export default router;

