import express from "express";
import { comment, deleteComment, getComments } from "../Controllers/Comment.js";
import { verifyToken } from "../middleware/verify.js";

const router = express.Router();

router.post("/", verifyToken, comment);
router.delete("/:id", verifyToken, deleteComment);
router.get("/:videoId", getComments)

export default router;
