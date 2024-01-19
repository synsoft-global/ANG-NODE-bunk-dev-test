import express from 'express';
import UserController from '../controllers/userController';
import { loginValidation, signUpValidation } from '../validator/userValidator';
import validate from '../validator/validate';

const router = express.Router();


router.post('/signup', signUpValidation, validate, UserController.registerUser);
router.post('/login', loginValidation, validate, UserController.userLogin);


export default router;
