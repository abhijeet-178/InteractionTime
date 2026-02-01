import FriendRequest from "../models/FriendRequest.js";
import User from "../models/user.js";

// ---------------- RECOMMENDED USERS ----------------
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId).select("friends");

    const filter = {
      isOnboarded: true,
      _id: { $ne: currentUserId },
    };

    // ✅ apply $nin only if friends exist
    if (currentUser.friends.length > 0) {
      filter._id.$nin = currentUser.friends;
    }

    const users = await User.find(filter);

    res.status(200).json(users);
  } catch (error) {
    console.error("getRecommendedUsers error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ---------------- MY FRIENDS ----------------
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("getMyFriends error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ---------------- SEND FRIEND REQUEST ----------------
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Friend request already exists" });
    }

    const request = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
      status: "pending",
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("sendFriendRequest error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ---------------- ACCEPT FRIEND REQUEST ----------------
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.recipient },
    });

    await User.findByIdAndUpdate(request.recipient, {
      $addToSet: { friends: request.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("acceptFriendRequest error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ---------------- GET FRIEND REQUESTS (PENDING + ACCEPTED) ----------------
export async function getFriendRequests(req, res) {
  try {
    const userId = req.user.id;

    // Incoming pending friend requests
    const incomingReqs = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    // Accepted friend requests involving the current user (either sender or recipient)
    const acceptedReqs = await FriendRequest.find({
      $or: [{ sender: userId }, { recipient: userId }],
      status: "accepted",
    })
      .populate("recipient sender", "fullName profilePic")
      .sort({ updatedAt: -1 }); // most recent first

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.error("getFriendRequests error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ---------------- OUTGOING FRIEND REQUESTS ----------------
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoing = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json(outgoing);
  } catch (error) {
    console.error("getOutgoingFriendReqs error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
