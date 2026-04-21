import { LayoutDashboard, BarChart3, Calendar, Settings, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ProfilePopover } from './ProfilePopover';
import { ManageResumesModal } from './ManageResumesModal';
import { SocialPortfolioModal } from './SocialPortfolioModal';
import { LogoutConfirmModal } from './LogoutConfirmModal';

export function Sidebar() {
  const location = useLocation();
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [showManageResumes, setShowManageResumes] = useState(false);
  const [showSocialPortfolio, setShowSocialPortfolio] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#14213D] flex flex-col z-10 overflow-visible">
      <div className="p-6 border-b border-[rgba(252,163,17,0.2)]">
        <h1 className="text-2xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="text-[#FCA311]">Mirae</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-[#FCA311] animate-pulse"></div>
          <span className="text-xs text-[#E5E5E5]">Connected</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-all duration-200
                ${isActive
                  ? 'bg-[rgba(252,163,17,0.1)] text-[#FCA311] border-l-4 border-[#FCA311] shadow-lg'
                  : 'text-[#E5E5E5] hover:bg-[rgba(252,163,17,0.05)] hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[rgba(252,163,17,0.2)]">
        <button
          onClick={() => setShowProfilePopover(!showProfilePopover)}
          className="w-full flex items-center gap-3 p-3 rounded-md bg-[rgba(252,163,17,0.05)] hover:bg-[rgba(252,163,17,0.1)] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#FCA311] flex items-center justify-center">
            <User className="w-5 h-5 text-[#14213D]" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-white">Alex Chen</div>
            <div className="text-xs text-[#E5E5E5]">Software Engineer</div>
          </div>
        </button>
      </div>

      {/* Profile Popover */}
      <AnimatePresence>
        {showProfilePopover && (
          <ProfilePopover
            onClose={() => setShowProfilePopover(false)}
            onManageResumes={() => {
              setShowProfilePopover(false);
              setShowManageResumes(true);
            }}
            onSocialPortfolio={() => {
              setShowProfilePopover(false);
              setShowSocialPortfolio(true);
            }}
            onLogout={() => {
              setShowProfilePopover(false);
              setShowLogoutConfirm(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Manage Resumes Modal */}
      <AnimatePresence>
        {showManageResumes && (
          <ManageResumesModal onClose={() => setShowManageResumes(false)} />
        )}
      </AnimatePresence>

      {/* Social & Portfolio Modal */}
      <AnimatePresence>
        {showSocialPortfolio && (
          <SocialPortfolioModal onClose={() => setShowSocialPortfolio(false)} />
        )}
      </AnimatePresence>

      {/* Logout Confirm Modal */}
      <AnimatePresence>
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
    </aside>
  );
}
