import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { FeaturesPage, PricingPage, AboutPage, ContactPage } from './components/pages/PublicPages';

// Student Pages
import { StudentDashboard } from './components/pages/student/StudentDashboard';
import { ProfilePage } from './components/pages/student/ProfilePage';
import { AcademicsPage } from './components/pages/student/AcademicsPage';
import { SkillsPage } from './components/pages/student/SkillsPage';
import { SkillGapPage } from './components/pages/student/SkillGapPage';
import { CareerRecommendationsPage } from './components/pages/student/CareerRecommendationsPage';
import { LearningPlanPage } from './components/pages/student/LearningPlanPage';
import { AssessmentsPage, AssessmentTakePage } from './components/pages/student/AssessmentsPages';
import { SecureExamMode } from './components/pages/student/SecureExamMode';
import { AssignmentsPage } from './components/pages/student/AssignmentsPage';
import { CodingCompilerPage, PracticePage } from './components/pages/student/CodingPracticePages';
import { ProjectsPage, HackathonsPage } from './components/pages/student/ProjectsHackathonsPages';
import { CoursesPage, ResourcesPage } from './components/pages/student/CoursesResourcesPages';
import { ResumeAnalyzerPage } from './components/pages/student/ResumeAnalyzerPage';
import { CompanyMatchingPage, PlacementReadinessPage } from './components/pages/student/CompanyMatchingReadinessPages';
import { PlacementDrivesPage, ApplicationsPage } from './components/pages/student/DrivesApplicationsPages';
import { NotificationsPage, SettingsPage } from './components/pages/student/NotificationsSettingsPages';

// Faculty Pages
import {
  FacultyDashboard,
  FacultyAssignments,
  FacultyRAGKnowledge,
} from './components/pages/faculty/FacultyPortalPages';

// Placement Coordinator Pages
import {
  CoordinatorDashboard,
  CompanyReadinessMatrix,
} from './components/pages/coordinator/CoordinatorPortalPages';

// Admin / Shared Management Pages
import { AdminDashboard, StudentsManagement } from './components/pages/admin/AdminDashboardStudents';
import { SkillsManagement, PlacementDrivesManagement, ApplicationsManagement } from './components/pages/admin/AdminManagementPages';
import {
  QuestionBank,
  AssessmentsManagement,
  CoursesManagement,
  CompaniesManagement,
  AnalyticsPage,
  ReportsPage,
  AdminSettings,
} from './components/pages/admin/AdminExtraPages';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student', 'STUDENT']} />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/academics" element={<AcademicsPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/skill-gap" element={<SkillGapPage />} />
                <Route path="/career-recommendations" element={<CareerRecommendationsPage />} />
                <Route path="/learning-plan" element={<LearningPlanPage />} />
                <Route path="/assessments" element={<AssessmentsPage />} />
                <Route path="/assessments/:id/take" element={<AssessmentTakePage />} />
                <Route path="/secure-exam/:id" element={<SecureExamMode />} />
                <Route path="/assignments" element={<AssignmentsPage />} />
                <Route path="/compiler" element={<CodingCompilerPage />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/hackathons" element={<HackathonsPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
                <Route path="/company-matching" element={<CompanyMatchingPage />} />
                <Route path="/placement-readiness" element={<PlacementReadinessPage />} />
                <Route path="/placement-drives" element={<PlacementDrivesPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Faculty Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['faculty', 'FACULTY']} />}>
                <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                <Route path="/faculty/assignments" element={<FacultyAssignments />} />
                <Route path="/faculty/rag" element={<FacultyRAGKnowledge />} />
              </Route>

              {/* Placement Coordinator Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['placement_coordinator', 'PLACEMENT_COORDINATOR', 'admin', 'ADMIN']} />}>
                <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
                <Route path="/coordinator/readiness-matrix" element={<CompanyReadinessMatrix />} />
              </Route>

              {/* Admin / Institutional Shared Routes */}
              <Route element={<ProtectedRoute allowedRoles={['faculty', 'FACULTY', 'placement_coordinator', 'PLACEMENT_COORDINATOR', 'admin', 'ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<StudentsManagement />} />
                <Route path="/admin/skills" element={<SkillsManagement />} />
                <Route path="/admin/assessments" element={<AssessmentsManagement />} />
                <Route path="/admin/question-bank" element={<QuestionBank />} />
                <Route path="/admin/courses" element={<CoursesManagement />} />
                <Route path="/admin/companies" element={<CompaniesManagement />} />
                <Route path="/admin/placement-drives" element={<PlacementDrivesManagement />} />
                <Route path="/admin/applications" element={<ApplicationsManagement />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/reports" element={<ReportsPage />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
