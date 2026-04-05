import React from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import toast from "react-hot-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/lib.js";
import { CameraIcon, ShuffleIcon, MapPinIcon, ShipWheelIcon } from "lucide-react";
import { LANGUAGES } from "../constants/index.js";
import { useNavigate } from "react-router-dom";

const OnBoarding = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = React.useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: "",
  });

  React.useEffect(() => {
    if (authUser) {
      setFormState({
        fullName: authUser.fullName || "",
        bio: authUser.bio || "",
        nativeLanguage: authUser.nativeLanguage || "",
        learningLanguage: authUser.learningLanguage || "",
        location: authUser.location || "",
        profilePic: authUser.profilePic || "",
      });
    }
  }, [authUser]);

 const navigate = useNavigate();

const { mutate, isLoading } = useMutation({
  mutationFn: completeOnboarding,
  onSuccess: (data) => {
    // Update the React Query cache
    queryClient.setQueryData(["authUser"], data.user);

    // Redirect to home page
    if (data.user.isOnboarded) {
      navigate("/", { replace: true });
      toast.success("Onboarding completed!");
    }
  },
  onError: (err) => {
    toast.error(err?.response?.data?.message || "Something went wrong");
  },
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formState);
  };

  const handleRandomAvatar = () => {
    const seed = Math.random().toString(36).slice(2);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setFormState((prev) => ({ ...prev, profilePic: avatar }));
    toast.success("Avatar generated!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-6">
      <div className="w-full max-w-lg">
        <h1 className="text-center text-white text-2xl font-semibold mb-8">
          Complete Your Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111827]/90 backdrop-blur-md rounded-xl p-8 space-y-8 shadow-lg border border-white/10"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-[#1f2937] border border-white/20 shadow-md">
              {formState.profilePic ? (
                <img src={formState.profilePic} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-white/30">
                  <CameraIcon size={48} />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold px-5 py-2 rounded transition"
            >
              <ShuffleIcon size={16} />
              Generate Random Avatar
            </button>
          </div>

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-white/70 mb-1 text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formState.fullName}
              onChange={handleChange}
              placeholder="Bob Doe"
              required
              className="bg-[#1f2937] text-white placeholder-white/40 rounded-md px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col">
            <label className="text-white/70 mb-1 text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={formState.bio}
              onChange={handleChange}
              placeholder="Tell others about yourself and your language learning goals"
              className="bg-[#1f2937] text-white placeholder-white/40 rounded-md px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[96px]"
            />
          </div>

          {/* Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-white/70 mb-1 text-sm font-medium">Native Language</label>
              <select
                name="nativeLanguage"
                value={formState.nativeLanguage}
                onChange={handleChange}
                required
                className="bg-[#1f2937] text-white rounded-md px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="" disabled>
                  Select your native language
                </option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-white/70 mb-1 text-sm font-medium">Learning Language</label>
              <select
                name="learningLanguage"
                value={formState.learningLanguage}
                onChange={handleChange}
                required
                className="bg-[#1f2937] text-white rounded-md px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="" disabled>
                  Select language you’re learning
                </option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col relative">
            <label className="text-white/70 mb-1 text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formState.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="bg-[#1f2937] text-white placeholder-white/40 rounded-md px-10 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
            />
            <MapPinIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] transition rounded-md py-3 text-white font-semibold text-lg flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <ShipWheelIcon className="animate-spin" /> : "Complete OnBoarding"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnBoarding;
