import React, { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/lib.js";

import Friendcard from "../components/Friendcard.jsx";
import NoFriendsFound from "../components/NoFriendFound.jsx";

const HomePage = () => {
  const queryClient = useQueryClient();

  // ---- Friends ----
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // ---- Recommended users ----
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
  });

  // ---- Outgoing requests ----
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // ---- Derived outgoing request IDs (NO state, NO useEffect) ----
  const outgoingRequestIds = useMemo(() => {
    return new Set(
      outgoingFriendReqs
        .map((req) => req.recipient?._id)
        .filter(Boolean)
    );
  }, [outgoingFriendReqs]);

  // ---- Mutation ----
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-100 text-base-content">
      <div className="container mx-auto space-y-10">
        {/* Friends Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Friends Grid */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <Friendcard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <div className="divider" />

        {/* Recommendations */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Meet New Learners
          </h2>
          <p className="opacity-70 mb-6">
            Discover language exchange partners
          </p>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center">
              <h3 className="font-semibold text-lg">
                No one new to meet right now
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const requestSent = outgoingRequestIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 border border-base-300"
                  >
                    <div className="card-body space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="size-14 rounded-full">
                            <img
                              src={user.profilePic || "/avatar.png"}
                              alt={user.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-60">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        className={`btn btn-block ${
                          requestSent ? "btn-disabled" : "btn-primary"
                        }`}
                        disabled={requestSent || isPending}
                        onClick={() => sendRequestMutation(user._id)}
                      >
                        {requestSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Add Friend
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
