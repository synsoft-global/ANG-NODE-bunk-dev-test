import express from 'express';
import { categoryValidator } from '../validator/categoryValidator';
import validate from '../validator/validate';
import { createCategory, getCategories } from '../controllers/categoryController';
import { verifyToken } from '../utils/auth';

const router = express.Router();

router.post('/create', verifyToken, categoryValidator, validate, createCategory)
router.get('/', verifyToken, getCategories)


export default router;
