import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Login from './impcomp/Login';
import Signup from './impcomp/Signup';
import { APP_NAME } from './utils/constants';
import { UserProvider } from './context/userDataContext';
import { ProjectProvider } from './context/projectContext';

import Dashboard from './pages/dashboard/Dashboard';
import MainLayout from './layouts/MainLayout';
import NewProject from './pages/projects/NewProject';
import RequirementHub from './pages/requirements/RequirementHub';
import VersionHistory from './pages/versions/VersionHistory';
import Settings from './pages/settings/Settings';
import ProjectSetup from './pages/projects/ProjectSetup';
import DocumentUpload from './pages/documents/DocumentUpload';
import AiChat from './pages/ai/AiChat';
import RequirementEditor from './pages/requirements/RequirementEditor';
import ExportCenter from './pages/exports/ExportCenter';
import Roles from './pages/roles/Roles';

import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  useEffect(() => {
    document.title = `${APP_NAME} - AI-Powered Requirement Writing`;
    const titleElement = document.querySelector('title[data-default]');
    if (titleElement) {
      titleElement.removeAttribute('data-default');
    }
  }, []);

  return (
    <UserProvider>
      <ProjectProvider>
        <Router>
          <ScrollToTop /> {/* ← NEW */}
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <Header />
                <Hero />
                <Features />
                <HowItWorks />
                <Testimonials />
                <Pricing />
                <FAQ />
                <CallToAction />
                <Footer />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/requirements" element={<RequirementHub />} />
              <Route path="/versions" element={<VersionHistory />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/projects/:projectId/setup" element={<ProjectSetup />} />
              <Route path="/projects/:projectId/documents" element={<DocumentUpload />} />
              <Route path="/projects/:projectId/chat" element={<AiChat />} />
              <Route path="/projects/:projectId/roles" element={<Roles />} />
              <Route path="/projects/:projectId/requirements" element={<RequirementEditor />} />
              <Route path="/projects/:projectId/export" element={<ExportCenter />} />
            </Route>
          </Routes>
        </Router>
      </ProjectProvider>
    </UserProvider>
  );
}

export default App;
