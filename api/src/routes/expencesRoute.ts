import express from 'express';
// import validate from '../validator/validate';
// import { addExpenceValidator, } from '../validator/groupValidator';
import { verifyToken } from '../utils/auth';
import { addExpence, getExpence } from '../controllers/expenceController';


const router = express.Router();


router.post('/add', verifyToken, addExpence)
router.get('/', verifyToken, getExpence)

export default router; 
