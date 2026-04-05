import express from "express";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.ProtectRoute.js";

const router = express.Router();

// ✅ All routes require auth
router.get("/", protectedRoute, getRecommendedUsers);
router.get("/friends", protectedRoute, getMyFriends);
router.post("/friend-request/:id", protectedRoute, sendFriendRequest);

// ✅ FIX: use PUT (matches frontend)
router.put("/friend-request/:id/accept", protectedRoute, acceptFriendRequest);

router.get("/friend-requests", protectedRoute, getFriendRequests);
router.get("/outgoing-friend-requests", protectedRoute, getOutgoingFriendReqs);

export default router;
