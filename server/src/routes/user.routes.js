import { Router } from 'express';
import { createConversation, changeName, changePassword, getConversations, getUser, searchUser, updateAvatar, deleteAvatar } from '../controllers/user.controller.js';
import { verifyAuthentication } from '../middleware/verify.middleware.js';
import { uploadMiddleware } from '../middleware/multer.middleware.js';

const router = Router();

router.route('/conversations').get(verifyAuthentication, getConversations);
router.route('/search').get(verifyAuthentication, searchUser);
router.route('/conversations').post(verifyAuthentication, createConversation);
router.route('/').get(verifyAuthentication, getUser);
router.route('/password').patch(changePassword);
router.route('/name').patch(changeName);
router.route('/avatar').patch(verifyAuthentication, uploadMiddleware.single('avatar'), updateAvatar);
router.route('/avatar').delete(verifyAuthentication, deleteAvatar);

const userRouter = router;

export default userRouter;