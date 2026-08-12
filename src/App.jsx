import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import SummaryPage from "./pages/SummaryPage";
import QuizPage from "./pages/QuizPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import ProfilePage from "./pages/ProfilePage";
import TopNavbar from "./components/TopNavbar";
import GuidePage from "./pages/GuidePage";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import ProgressLoader from "./components/ProgressLoader";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import GoogleSuccessPage from "./pages/GoogleSuccessPage";
import GooglePasswordPage from "./pages/GooglePasswordPage";
import NotesPage from "./pages/NotesPage";
import QuizHistoryPage from "./pages/QuizHistoryPage";
import SummaryHistoryPage from "./pages/SummaryHistoryPage";
import HighestScorePage from "./pages/HighestScorePage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#111827",
            borderRadius: "10px",
            fontSize: "14px"
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#fff"
            }
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fff"
            }
          }
        }}
      />

      <Routes>


        {/* Public Routes */}

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />

        <Route
          path="/google-success"
          element={<GoogleSuccessPage />}
        />

        <Route
          path="/google-password"
          element={<GooglePasswordPage />}
        />

        {/* Protected Routes */}

        <Route
          path="/*"
          element={

            <ProtectedRoute>

              <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-950 transition-colors duration-300 relative">

                {/* Desktop Sidebar */}

                <div className="hidden lg:block">

                  <Sidebar />

                </div>

                {/* Mobile Sidebar */}

                <div
                  className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >

                  <Sidebar closeSidebar={() => setSidebarOpen(false)} />

                </div>

                {/* Backdrop */}

                {sidebarOpen && (

                  <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  />

                )}

                <div className="flex-1 flex flex-col min-w-0">

                  <TopNavbar
                    openSidebar={() => setSidebarOpen(true)}
                  />

                  <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4 py-4 sm:p-6 sm:py-6 lg:p-10 lg:py-8">

                    <Routes>

                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />

                      <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                      />

                      <Route
                        path="/highest-score"
                        element={<HighestScorePage />}
                      />

                      <Route
                        path="/upload"
                        element={<UploadPage />}
                      />

                      <Route
                        path="/notes"
                        element={<NotesPage />}
                      />

                      <Route
                        path="/chat"
                        element={<ChatPage />}
                      />

                      <Route
                        path="/summary"
                        element={<SummaryPage />}
                      />

                      <Route
                        path="/summary-history"
                        element={<SummaryHistoryPage />}
                      />

                      <Route
                        path="/quiz"
                        element={<QuizPage />}
                      />

                      <Route
                        path="/quiz-history"
                        element={<QuizHistoryPage />}
                      />

                      <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                      />

                      <Route
                        path="/profile"
                        element={<ProfilePage />}
                      />

                      <Route
                        path="/guide"
                        element={<GuidePage />}
                      />

                    </Routes>

                  </div>

                </div>

              </div>

            </ProtectedRoute>

          }
        />

      </Routes>
      <ProgressLoader />

    </BrowserRouter>

  );

}

export default App;