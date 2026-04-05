import { axiosInstance } from "./axios.js";

// Helper to extract user safely
const getUser = (res) => res?.data?.user || null;

// ✅ Sign Up
export const signUp = async (userData) => {
  try {
    const res = await axiosInstance.post("/auth/signup", userData, {
      withCredentials: true,
    });
    return { user: getUser(res) };
  } catch (err) {
    console.error("Signup error:", err);
    return { user: null };
  }
};

// ✅ Login
export const loginUser = async (userData) => {
  try {
    const res = await axiosInstance.post("/auth/login", userData, {
      withCredentials: true,
    });
    return { user: getUser(res) };
  } catch (err) {
    console.error("Login error:", err);
    return { user: null };
  }
};

// ✅ Logout (no body needed)
export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout", null, {
      withCredentials: true,
    });
    return { user: null };
  } catch (err) {
    console.error("Logout error:", err);
    return { user: null };
  }
};

// ✅ Get Authenticated User
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/user", {
      withCredentials: true,
    });
    return { user: getUser(res) };
  } catch (err) {
    console.error("Get auth user error:", err);
    return { user: null };
  }
};

// ✅ Complete Onboarding
export const completeOnboarding = async (userData) => {
  try {
    const res = await axiosInstance.post("/auth/onboarding", userData, {
      withCredentials: true,
    });
    return { user: getUser(res) };
  } catch (err) {
    console.error("Onboarding error:", err);
    return { user: null };
  }
};

export async function getUserFriends(){
  const response=await axiosInstance.get("/users/friends")
  return response.data;
}
export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs(){
  const response=await axiosInstance.get("/users/outgoing-friend-requests")
  return response.data;
}
export async function sendFriendRequest(userId){
  const response=await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}
export async function getFriendRequests() {
  const response=await axiosInstance.get("/users/friend-requests");
  return response.data;
}
export async function acceptFriendRequest(requestId){
const response=await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
return response.data;
}

export async function getStreamToken(){
 const response=await axiosInstance.get("/chat/token");
 return response.data;
}
