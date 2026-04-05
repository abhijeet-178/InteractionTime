import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnBoarding from "./pages/OnBoarding.jsx";
import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/useAuthUser.js";
import PageLoader from "./components/PageLoader.jsx";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useTheme.js";

const App = () => {
  const { authUser, isLoading } = useAuthUser();
  const { theme, setTheme } = useThemeStore();

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <button onClick={() => setTheme("night")}>update to night</button>
      <Toaster />
      <Routes>
        {/* Public Pages */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
        />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            authUser ? (
              authUser.isOnboarded ? (
                <Navigate to="/" replace />
              ) : (
                <OnBoarding />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Private Pages */}
        <Route
          path="/"
          element={
            authUser ? (
              authUser.isOnboarded ? (
                <Layout showSidebar={true}>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            authUser && authUser.isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationPage />
              </Layout>
            ) : (
              <Navigate
                to={!authUser ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            authUser && authUser.isOnboarded  ? (
              <CallPage />
            ) : (
              <Navigate to={!authUser?"/login":"/onboarding"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            authUser && authUser.isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate
                to={!authUser ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
