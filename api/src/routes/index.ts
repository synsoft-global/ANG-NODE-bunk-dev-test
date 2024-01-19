
import express from 'express'
const router = express.Router();

import user from './userRoute';
import category from './categoryRoute';
import group from './groupRoute';
import common from './commonRoute';
import expence from './expencesRoute';


router.use('/', common);
router.use('/user', user);
router.use('/category', category);
router.use('/group', group);
router.use('/expence', expence);


export default router;
