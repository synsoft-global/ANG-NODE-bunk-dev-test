import express from 'express';
import { verifyToken } from '../utils/auth';
import { createExpenseWithDistributions, deleteExpense, finalExpence, getExpence, getExpenceById, getExpenseByGroupId, getTotalExpensesByGroupId, updateExpense } from '../controllers/expenceController';
import { expenseValidator } from '../validator/expenceValidtor';
import validate from '../validator/validate';
import { commonpValidtorForId } from '../validator/groupValidator';


const router = express.Router();


router.post('/add', verifyToken, expenseValidator, validate, createExpenseWithDistributions)
router.get('/', verifyToken, getExpence)
router.get('/:id', verifyToken, getExpenceById)
router.get('/getExpenceByGroupId/:id', verifyToken, commonpValidtorForId, validate, getExpenseByGroupId)
router.put('/updateExpence/:id', verifyToken, expenseValidator, validate, updateExpense)
router.get('/getTotalExpensesByGroupId/:id', verifyToken, commonpValidtorForId, validate, getTotalExpensesByGroupId)
router.get('/finalExpence/:id', verifyToken, commonpValidtorForId, validate, finalExpence)
router.delete('/delete/:id', verifyToken, deleteExpense)

export default router;
