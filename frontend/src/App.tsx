import { lazy, Suspense, useLayoutEffect } from "react";
import { Outlet, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AosProvider from "@/components/AosProvider";
import HomePage from "@/pages/HomePage";
import AboutLayout from "@/pages/about/AboutLayout";
import AboutPage from "@/pages/about/AboutPage";
import AboutClientsPage from "@/pages/about/AboutClientsPage";
import MissionPage from "@/pages/about/MissionPage";
import ConstructionPage from "@/pages/businesses/ConstructionPage";
import RColorsPage from "@/pages/businesses/RColorsPage";
import EstateLayout from "@/pages/businesses/estate/EstateLayout";
import EstateHubPage from "@/pages/businesses/estate/EstateHubPage";
import EstateCityPage from "@/pages/businesses/estate/EstateCityPage";
import EstateLocalityPage from "@/pages/businesses/estate/EstateLocalityPage";
import ClientsPage from "@/pages/ClientsPage";
import ContactPage from "@/pages/ContactPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import ProjectDetailPage from "@/pages/projects/ProjectDetailPage";
import WhyUsPage from "@/pages/WhyUsPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Careers (with zod) and admin are separate chunks, so the main bundle stays as it was
const CareersPage = lazy(() => import("@/pages/careers/CareersPage"));
const GeneralApplicationPage = lazy(() => import("@/pages/careers/GeneralApplicationPage"));
const JobDetailPage = lazy(() => import("@/pages/careers/JobDetailPage"));
const RequireAdmin = lazy(() => import("@/components/admin/RequireAdmin"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminJobsPage = lazy(() => import("@/pages/admin/AdminJobsPage"));
const AdminJobEditorPage = lazy(() => import("@/pages/admin/AdminJobEditorPage"));
const AdminApplicationsPage = lazy(() => import("@/pages/admin/AdminApplicationsPage"));
const AdminApplicationDetailPage = lazy(() => import("@/pages/admin/AdminApplicationDetailPage"));

/** New pages start at the top (or at #hash); back/forward and `scroll: false` keep the position */
function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  useLayoutEffect(() => {
    if (navigationType === "POP" || (location.state as { scroll?: boolean } | null)?.scroll === false) return;
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    // Jump, don't animate: globals.css sets scroll-behavior: smooth for in-page links
    if (target) target.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per navigation
  }, [location.key]);
  return null;
}

/** Site chrome for every public page */
function PublicLayout() {
  return (
    <AosProvider>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
        {/* Fills the viewport like LoadState while a lazy page's chunk loads */}
        <Suspense fallback={<div aria-busy="true" className="min-h-screen" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </AosProvider>
  );
}

/** Admin pages: their own layout, no public Navbar/Footer */
function AdminShell() {
  return (
    <Suspense fallback={<div aria-busy="true" className="min-h-screen bg-gray-50" />}>
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    </Suspense>
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-navy focus:outline focus:outline-2 focus:outline-brand-navy"
      >
        Skip to content
      </a>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutLayout />}>
            <Route index element={<AboutPage />} />
            <Route path="clients" element={<AboutClientsPage />} />
            <Route path="mission" element={<MissionPage />} />
          </Route>
          <Route path="/businesses/construction" element={<ConstructionPage />} />
          <Route path="/businesses/r-colors" element={<RColorsPage />} />
          <Route path="/businesses/estate" element={<EstateLayout />}>
            <Route index element={<EstateHubPage />} />
            <Route path=":city" element={<EstateCityPage />} />
            <Route path=":city/:locality" element={<EstateLocalityPage />} />
          </Route>
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/apply" element={<GeneralApplicationPage />} />
          <Route path="/careers/:slug" element={<JobDetailPage />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<div aria-busy="true" className="min-h-screen bg-gray-50" />}>
              <AdminLoginPage />
            </Suspense>
          }
        />
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="jobs/new" element={<AdminJobEditorPage />} />
          <Route path="jobs/:id/edit" element={<AdminJobEditorPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="applications/:id" element={<AdminApplicationDetailPage />} />
          <Route path="*" element={<p className="text-gray-600">This admin page doesn&apos;t exist.</p>} />
        </Route>
      </Routes>
    </>
  );
}
