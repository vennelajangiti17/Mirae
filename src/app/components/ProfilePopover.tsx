import { FileText, Link2, Moon, HelpCircle, LogOut, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../hooks/useTheme';

interface Props {
  onClose: () => void;
  onManageResumes: () => void;
  onSocialPortfolio: () => void;
  onLogout: () => void;
}

export function ProfilePopover({ onClose, onManageResumes, onSocialPortfolio, onLogout }: Props) {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const menuItems = [
    { icon: FileText, label: 'Manage Resumes', onClick: onManageResumes },
    { icon: Link2, label: 'Social & Portfolio', onClick: onSocialPortfolio },
    { icon: Moon, label: 'Theme (Dark/Light)', hasToggle: true },
    { icon: HelpCircle, label: 'Help & Community', onClick: () => {} },
  ];

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[2147483645]"
        onClick={onClose}
      />

      {/* Popover */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute left-64 bottom-24 z-[2147483646] w-[280px] rounded-md border border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
        style={{ position: 'absolute' }}
      >
        {/* Header Section */}
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            {/* Avatar with Hover State */}
            <div
              className="relative"
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
            >
              <div className="w-12 h-12 rounded-full bg-[#FCA311] flex items-center justify-center text-[#000000] font-bold text-lg relative overflow-hidden cursor-pointer">
                <span className={`transition-opacity ${isHoveringAvatar ? 'opacity-30' : 'opacity-100'}`}>AC</span>
                <AnimatePresence>
                  {isHoveringAvatar && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                      >
                        <Camera className="w-5 h-5 text-white" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#14213D] text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                      >
                        Change Photo
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="font-bold text-[#000000]">Alex Chen</div>
              <div className="text-xs text-[#73766A]">Software Engineer</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#E5E5E5] hover:bg-opacity-50 transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-[#14213D]" />
                <span className="flex-1 text-sm text-[#14213D] font-medium">{item.label}</span>
                {item.hasToggle && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme();
                    }}
                    className={`w-10 h-5 rounded-full transition-all cursor-pointer ${
                      isDarkMode ? 'bg-[#FCA311]' : 'bg-[#E5E5E5]'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isDarkMode ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-4 h-4 bg-white rounded-full mt-0.5 shadow-md"
                    />
                  </div>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-2 border-t border-[#E5E5E5]"></div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#E5E5E5] hover:bg-opacity-50 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-[#E11D48]" />
            <span className="flex-1 text-sm text-[#E11D48] font-medium">Logout</span>
          </button>
        </div>
      </motion.div>
    </>,
    document.body,
  );
}
