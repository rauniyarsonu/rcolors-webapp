import { useLayoutEffect } from "react";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
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
import CareersPage from "@/pages/careers/CareersPage";
import GeneralApplicationPage from "@/pages/careers/GeneralApplicationPage";
import JobDetailPage from "@/pages/careers/JobDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";

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
      <AosProvider>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
          <Routes>
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
          </Routes>
        </main>
        <Footer />
      </AosProvider>
    </>
  );
}
