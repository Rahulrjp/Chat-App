import { Router } from 'express';
import { addToChattedUser, changeName, changePassword, getChattedUser, getUser, searchUser } from '../controllers/user.controller.js';
import { verifyAuthentication } from '../middleware/verify.middleware.js';

const router = Router();

router.route('/chatted').post(getChattedUser);
router.route('/search').post(searchUser)
router.route('/').get(verifyAuthentication, getUser)
router.route('/password').patch(changePassword)
router.route('/name').patch(changeName)
router.route('/chatted').patch(addToChattedUser)

const userRouter = router;

export default userRouter;