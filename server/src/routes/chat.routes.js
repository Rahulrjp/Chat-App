import { Router } from "express";
import { deleteChats, getChatData, getUserChat, storeChatData } from "../controllers/chat.controller.js";
import { verifyAuthentication } from "../middleware/verify.middleware.js";

const router = Router();

router.route('/').post(storeChatData)
router.route('/').get(verifyAuthentication, getChatData)
router.route('/:id').get(verifyAuthentication, getUserChat)
router.route('/').delete(verifyAuthentication, deleteChats)

const chatRouter = router;

export default chatRouter;