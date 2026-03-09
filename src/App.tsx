import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PlanPage } from './pages/PlanPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { LoginPage } from './pages/auth/LoginPage';
import { CoachDashboardPage } from './pages/coach/CoachDashboardPage';
import { CoachAthletePlanPage } from './pages/coach/CoachAthletePlanPage';
import { WorkoutEditorPage } from './pages/coach/WorkoutEditorPage';

// Helper to redirect based on role if accessing root
const RoleRedirect: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { userRole, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (userRole === 'coach') {
    return <Navigate to="/coach" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Athlete Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleRedirect>
                  <PlanPage />
                </RoleRedirect>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout/:id"
            element={
              <ProtectedRoute>
                <WorkoutPage />
              </ProtectedRoute>
            }
          />

          {/* Coach Routes */}
          <Route
            path="/coach"
            element={
              <ProtectedRoute>
                <CoachDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach/athlete/:athleteId"
            element={
              <ProtectedRoute>
                <CoachAthletePlanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach/athlete/:athleteId/workout/new"
            element={
              <ProtectedRoute>
                <WorkoutEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach/athlete/:athleteId/workout/:workoutId/edit"
            element={
              <ProtectedRoute>
                <WorkoutEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach/athlete/:athleteId/workout/:id"
            element={
              <ProtectedRoute>
                <WorkoutPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
