import { Router } from 'express';
import { createConversation, changeName, changePassword, getConversations, getUser, searchUser } from '../controllers/user.controller.js';
import { verifyAuthentication } from '../middleware/verify.middleware.js';

const router = Router();

router.route('/conversations').get(verifyAuthentication, getConversations);
router.route('/search').get(searchUser);
router.route('/conversations').post(verifyAuthentication, createConversation);
router.route('/').get(verifyAuthentication, getUser)
router.route('/password').patch(changePassword)
router.route('/name').patch(changeName)
// router.route('/conversations').patch(createConversation)

const userRouter = router;

export default userRouter;