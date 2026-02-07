import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { checkAuth } from "../slices/userSlice";

import SignUp from "./Pages/Signup";
import Home from "./Pages/Home";
import ShimmerEffect from "./Pages/ShimmerEffect";
import Problems from "./Pages/Problems";
import Solved from "./Pages/UserSolved";
import ProblemPage from "./Pages/ProblemPage";
import Admin from "./Pages/Admin";
import AdminPanel from "../src/components/AdminPanel";
import AdminDelete from "../src/components/AdminDelete";
import AdminVideo from "../src/components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
import UserProfile from "./Pages/UserProfile";
import TagProblemsPage from "./Pages/SpecificProblemPage";
import OtpVerifyPage from "./Pages/VerfiyOtp";
import SearchProfile from "./Pages/SearchProfile";
import Root from "./Pages/RootPage"
export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const isAdmin = user?.email === import.meta.env.VITE_PROJECT_ADMIN;

  // ✅ Check Auth on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // 💾 Store last visited path on route change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("lastPath", location.pathname);
    }
  }, [location.pathname, isAuthenticated]);

  // 🚀 Restore path after reload
  useEffect(() => {
    const lastPath = localStorage.getItem("lastPath");
    // if user is authenticated and currently at root `/` or `/signup`, go to last path
    if (isAuthenticated && lastPath && (location.pathname === "/" || location.pathname === "/signup")) {
      navigate(lastPath, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <ShimmerEffect />;
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/signup"
        element={!isAuthenticated ? <SignUp /> : <Navigate to="/" replace />}
      />

        <Route
        path="/verifyOtp"
        element={!isAuthenticated ? <OtpVerifyPage /> : <Navigate to="/" replace />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={!isAuthenticated ? <Root /> : <Navigate to="/home" replace />}
      />
      <Route
        path="/home"
        element={isAuthenticated ? <Home /> : <Navigate to="/signup" replace />}
      />
      <Route
        path="/problems"
        element={isAuthenticated ? <Problems /> : <Navigate to="/signup" replace />}
      />
      <Route
        path="/solvedByUser"
        element={isAuthenticated ? <Solved /> : <Navigate to="/signup" replace />}
      />
      <Route
        path="/userProfile"
        element={isAuthenticated ? <UserProfile /> : <Navigate to="/signup" replace />}
      />
      <Route
        path="/problem/:problemId"
        element={isAuthenticated ? <ProblemPage /> : <Navigate to="/signup" replace />}
      />
      <Route
        path="/problems/byTag/:tag"
        element={isAuthenticated ? <TagProblemsPage /> : <Navigate to="/signup" replace />}
      />

      <Route
        path="/searchProfile"
        element={isAuthenticated ? <SearchProfile /> : <Navigate to="/signup" replace />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={isAuthenticated && isAdmin ? <Admin /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/create"
        element={isAuthenticated && isAdmin ? <AdminPanel /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/delete"
        element={isAuthenticated && isAdmin ? <AdminDelete /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/video"
        element={isAuthenticated && isAdmin ? <AdminVideo /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/upload/:problemId"
        element={isAuthenticated && isAdmin ? <AdminUpload /> : <Navigate to="/" replace />}
      />

      {/* Catch-all Route */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/signup"} replace />}
      />
    </Routes>
  );
}
