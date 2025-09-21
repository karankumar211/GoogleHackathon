import { Router } from 'express';
import { checkLoanLink } from '../controllers/verification.controller.js';
import { verifyJWT } from '../../../middlewares/auth.middleware.js';

const router = Router();

// Protect all verification routes
router.use(verifyJWT);

router.route('/link').post(checkLoanLink);

export default router;
