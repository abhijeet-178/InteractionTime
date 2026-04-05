import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "../lib/lib.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: signUpMutation,
    isLoading: signupLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: signUp,
    onSuccess: async () => {
      // Refetch the authenticated user after signup
      await queryClient.refetchQueries({ queryKey: ["authUser"] });
      navigate("/"); // redirect to home
    },
    onError: (err) => {
      console.log("Signup error:", err.response?.data || err.message);
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutation(signupData);
    console.log(e);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left - Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Interaction Time
            </span>
          </div>

          {isError && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message || "Something went wrong!"}</span>
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Create An Account</h2>
                <p className="text-sm opacity-70">
                  Join Streamify and start your streaming journey today!
                </p>
              </div>

              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                required
              />
              <p className="text-xs opacity-70">
                Password must be at least 6 characters long.
              </p>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={signupLoading}
              >
                {signupLoading ? (
                  <span className="loading loading-spinner loading-xs">Loading...</span>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Right - Illustration */}
        <div className="hidden lg:flex w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8 text-center">
            <img src="/login.png" alt="illustration" />
            <h2 className="text-xl font-semibold mt-6">
              Connect with language partners worldwide
            </h2>
            <p className="opacity-70">
              Practice conversation, make friends, and improve your language skills together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
