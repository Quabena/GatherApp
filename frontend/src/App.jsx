import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventDetailsPage from "./pages/EventDetailsPage";
// import UserDashboard from "./pages/UserDashboard";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import SavedEvents from "./components/SavedEvents/SavedEvents";
import PastEvents from "./components/PastEvents/PastEvents";
import Settings from "./components/Settings/Settings";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:id" element={<EventDetailsPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<SavedEvents />} />
        <Route path="past" element={<PastEvents />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/search" element={<SearchPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
