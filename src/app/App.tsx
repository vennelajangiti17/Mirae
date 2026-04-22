import { BrowserRouter, Routes, Route } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { CalendarView } from './components/CalendarView';
import { ExtensionPopup } from './components/ExtensionPopup';
import { Settings } from './components/Settings';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ManageResumesModal } from './components/ManageResumesModal';
import { SocialPortfolioModal } from './components/SocialPortfolioModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';

export default function App() {
  const [showExtension, setShowExtension] = useState(false);
  const [showManageResumes, setShowManageResumes] = useState(false);
  const [showSocialPortfolio, setShowSocialPortfolio] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const hasBlockingOverlay = showManageResumes || showSocialPortfolio || showLogoutConfirm;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#E5E5E5]">
        <div
          aria-hidden={hasBlockingOverlay}
          className={hasBlockingOverlay ? 'pointer-events-none select-none' : undefined}
        >
          <Sidebar
            onManageResumesOpen={() => setShowManageResumes(true)}
            onSocialPortfolioOpen={() => setShowSocialPortfolio(true)}
            onLogoutOpen={() => setShowLogoutConfirm(true)}
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>

          {showExtension && <ExtensionPopup onClose={() => setShowExtension(false)} />}
        </div>

        <AnimatePresence>
          {showManageResumes && (
            <ManageResumesModal onClose={() => setShowManageResumes(false)} />
          )}
          {showSocialPortfolio && (
            <SocialPortfolioModal onClose={() => setShowSocialPortfolio(false)} />
          )}
          {showLogoutConfirm && (
            <LogoutConfirmModal
              onClose={() => setShowLogoutConfirm(false)}
              onConfirm={() => {
                setShowLogoutConfirm(false);
                console.log('User logged out');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
