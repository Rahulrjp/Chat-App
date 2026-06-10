import { Router } from "express";
import { deleteChats, getMessages, getUserChat, storeChatData, uploadAttachment, deleteMessage, deleteMultipleMessages, clearChat } from "../controllers/chat.controller.js";
import { verifyAuthentication } from "../middleware/verify.middleware.js";
import { uploadMiddleware } from "../middleware/multer.middleware.js";

const router = Router();

router.route('/').post(storeChatData)
router.route('/').get(verifyAuthentication, getMessages)
router.route('/upload').post(verifyAuthentication, uploadMiddleware.array('files', 5), uploadAttachment)
router.route('/message/:id').delete(verifyAuthentication, deleteMessage)
router.route('/delete-multiple').post(verifyAuthentication, deleteMultipleMessages)
router.route('/clear/:conversationId').delete(verifyAuthentication, clearChat)
router.route('/:id').get(verifyAuthentication, getUserChat)
router.route('/').delete(verifyAuthentication, deleteChats)

const chatRouter = router;

export default chatRouter;