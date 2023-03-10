import express from 'express';
import { calculatePayout } from '../controllers/payoutController';
export const router = express.Router();
router.get('/payouts', calculatePayout);

router.post('/payouts', calculatePayout);

export default router;