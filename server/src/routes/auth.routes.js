import { Router } from 'express';
import { createUser, loginUser, logout, sendOtp, verifyAuth, verifyOtp } from '../controllers/auth.controller.js';
import { verifyAuthentication } from '../middleware/verify.middleware.js';

const router = Router();

router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/otp/send').post(sendOtp);
router.route('/otp/verify').post(verifyOtp);
router.route('/user/verify').get(verifyAuthentication, verifyAuth);

const authRouter = router;

export default authRouter;
