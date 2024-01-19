import express from 'express';
import { createGroupWithParticipants, deleteGroup, getDataByGroupId, getGroup, getGroupMembers, getLoggedInUserGroup, groupMemberBygroupId, joinGroup, updateGroup } from '../controllers/groupController';
import { verifyToken } from '../utils/auth';
import { groupValidtor, joinGroupValidtor } from '../validator/groupValidator';
import validate from '../validator/validate';

const router = express.Router();


router.post('/create', verifyToken, groupValidtor, validate, createGroupWithParticipants)
router.post('/join/:id', verifyToken, joinGroupValidtor, validate, joinGroup)
router.get('/getAllGroupMember/:id', verifyToken, groupMemberBygroupId)
router.put('/editGroup/:id', verifyToken, groupValidtor, validate, updateGroup)

router.get('/', verifyToken, getGroup)
router.get('/members/:id', verifyToken, getGroupMembers)
router.get('/myGroup', verifyToken, getLoggedInUserGroup)
router.get('/getDataByGroupId/:id', verifyToken, getDataByGroupId)
router.delete('/remove/:id', verifyToken, deleteGroup)

export default router;
