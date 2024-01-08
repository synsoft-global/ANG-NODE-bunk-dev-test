import express from 'express';
import { insertCountriesToDatabase, getCoutryList, searchCountry, inviteFriends } from '../controllers/commonController';
import { verifyToken } from '../utils/auth';
import { emailValidation } from '../validator/userValidator';
import validate from '../validator/validate';

const router = express.Router();


router.get('/countries', getCoutryList)
router.get('/serachCountry', searchCountry)
router.post('/country/add', insertCountriesToDatabase)
router.post('/invite', verifyToken, emailValidation, validate, inviteFriends)


export default router;
