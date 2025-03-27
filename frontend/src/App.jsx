import React, { Suspense, useEffect } from "react";
import { Route, Routes, Outlet, Navigate, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "./components/Footer/Footer";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import SavedEvents from "./components/SavedEvents/SavedEvents";
import PastEvents from "./components/PastEvents/PastEvents";
import Settings from "./components/Settings/Settings";
import EventForm from "./components/EventForm/EventForm";
import NotFoundPage from "./pages/NotFoundPage";
import FullPageLoader from "./components/FullPageLoader/FullPageLoader";
import { useAuth } from "./hooks/useAuth";

// Lazy-loaded pages
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ExplorePage = React.lazy(() => import("./pages/ExplorePage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const EventDetailsPage = React.lazy(() => import("./pages/EventDetailsPage"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));

// Layout component for pages with footer
const MainLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <FullPageLoader />;
  }

  // Redirect to auth if not authenticated
  // if (!user) {
  //   return <Navigate to="/auth" state={{ from: location }} replace />;
  // }

  return children;
};

// Public Route Wrapper (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <FullPageLoader />;
  }

  // If user is authenticated and tries to access auth page, redirect to dashboard
  if (user && location.pathname === "/auth") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ScrollToTop />
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Public Routes with Footer */}
        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:id"
            element={
              <ProtectedRoute>
                <EventDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Authentication Route */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SavedEvents />} />
          <Route path="past" element={<PastEvents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="create-event" element={<EventForm />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
