import express from "express";
import {
  addView,
  updateVideo,
  createVideo,
  deleteVideo,
  getVideo,
  getTrendingVideos,
  getRandomVideos,
  getSuscribedVideos,
   getVideosByTags,
   searchVideos,
   getUserVideos
} from "../Controllers/Video.js";
import { verifyToken } from "../middleware/verify.js";

const router = express.Router();

router.post("/", verifyToken, createVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.get("/trend", getTrendingVideos);
router.get("/random", getRandomVideos);
router.get("/sub", verifyToken, getSuscribedVideos);
router.get("/tags", getVideosByTags);
router.get("/search", searchVideos)
router.get("/findAll/:id", getUserVideos)

export default router;
