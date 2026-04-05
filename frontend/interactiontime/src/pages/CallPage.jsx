import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

// FIXED: Added @ symbol to the path
import "@stream-io/video-react-sdk/dist/css/styles.css"; 
import toast from "react-hot-toast";
import { getStreamToken } from "../lib/lib";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "../components/PageLoader"; // Ensure this is imported

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();
  const navigate = useNavigate();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      // Check for tokenData existence before accessing properties
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call.");
        navigate("/");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    // Cleanup function to leave call when component unmounts
    return () => {
      if (call) call.leave();
      if (client) client.disconnectUser();
    };
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    /* FIXED: Changed flex-col items-center to h-screen w-full 
       This ensures the video player fills the whole viewport. */
    <div className="h-screen w-full bg-slate-900">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          <p>Initializing call connection...</p>
        </div>
      )}
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // Handle navigation if the user leaves or the call ends
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Joining video room...
      </div>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls onLeave={() => navigate("/")} />
    </StreamTheme>
  );
};

export default CallPage;