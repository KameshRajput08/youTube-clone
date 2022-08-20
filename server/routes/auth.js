import express from "express";
import {
  deleteUser,
  dislikeVideo,
  getUser,
  likeVideo,
  loginUser,
  registerUser,
  suscribeUser,
  unsuscribeUser,
  updateUser,
  googleAuth
} from "../Controllers/auth.js";
import { verifyToken } from "../middleware/verify.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.get("/find/:id", getUser);
router.delete("/:id", verifyToken, deleteUser);
router.put("/:id", verifyToken, updateUser);
router.put("/suscribe/:id", verifyToken, suscribeUser);
router.put("/unsuscribe/:id", verifyToken, unsuscribeUser);
router.put("/like/:videoId", verifyToken, likeVideo);
router.put("/dislike/:videoId", verifyToken, dislikeVideo);

export default router;
