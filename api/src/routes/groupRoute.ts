import express from 'express';
// import validate from '../validator/validate';
// import { groupValidator } from '../validator/groupValidator';
import { createGroup, getGroup, getGroupMembers } from '../controllers/groupController';
import { verifyToken } from '../utils/auth';


const router = express.Router();


router.post('/create', verifyToken, createGroup)
router.get('/', verifyToken, getGroup)
router.get('/members/:id', verifyToken, getGroupMembers)

export default router;
