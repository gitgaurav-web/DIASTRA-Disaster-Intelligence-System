import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DemoBanner } from '@/components/Layout';

import Home from '@/pages/Home';
import About from '@/pages/About';
import DisasterInformation from '@/pages/DisasterInformation';
import RiskMap from '@/pages/RiskMap';
import Habitations from '@/pages/Habitations';
import HabitationDetails from '@/pages/HabitationDetails';
import Capacity from '@/pages/Capacity';
import Relocation from '@/pages/Relocation';
import RelocationSites from '@/pages/RelocationSites';
import Analytics from '@/pages/Analytics';
import Resources from '@/pages/Resources';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Admin from '@/pages/Admin';
import Settings from '@/pages/Settings';
import CommunityReports from '@/pages/CommunityReports';
import RescueTeams from '@/pages/RescueTeams';
import EmergencyAlerts from '@/pages/EmergencyAlerts';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50">
        <DemoBanner />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/disasters" element={<DisasterInformation />} />
            <Route path="/risk-map" element={<RiskMap />} />
            <Route path="/habitations" element={<Habitations />} />
            <Route path="/habitations/:id" element={<HabitationDetails />} />
            <Route path="/capacity" element={<Capacity />} />
            <Route path="/relocation" element={<Relocation />} />
            <Route path="/relocation-sites" element={<RelocationSites />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/community-reports" element={<CommunityReports />} />
            <Route path="/rescue-teams" element={<RescueTeams />} />
            <Route path="/emergency-alerts" element={<EmergencyAlerts />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
