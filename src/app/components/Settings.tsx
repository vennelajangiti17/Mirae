import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Switch from '@radix-ui/react-switch';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useTheme } from '../hooks/useTheme';
import {
  User,
  Bell,
  Briefcase,
  Palette,
  Chrome,
  Shield,
  AlertTriangle,
  Upload,
  Camera,
  Lock,
  LogOut,
  Download,
  UserX,
  RotateCcw,
  ChevronRight,
  X
} from 'lucide-react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function ToggleSwitch({ label, checked, onCheckedChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[#14213D]" style={{ fontFamily: 'Outfit' }}>{label}</span>
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="relative w-11 h-6 bg-gray-300 rounded-full transition-all duration-300 data-[state=checked]:bg-[#FCA311] outline-none cursor-pointer shadow-sm"
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-300 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px] shadow-md" />
      </Switch.Root>
    </div>
  );
}

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  danger?: boolean;
  delay?: number;
}

function SectionCard({ icon, title, subtitle, children, danger, delay = 0 }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)' }}
      className={`bg-white rounded-xl p-6 shadow-md transition-all duration-300 ${
        danger ? 'border-2 border-[#DC6B6B] bg-red-50/20' : ''
      }`}
    >
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1.5">
          <div className={`${danger ? 'text-[#DC6B6B]' : 'text-[#FCA311]'}`}>
            {icon}
          </div>
          <h2
            className={`text-2xl font-bold ${danger ? 'text-[#DC6B6B]' : 'text-[#14213D]'}`}
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
          >
            {title}
          </h2>
        </div>
        <p className="text-sm text-[#14213D]/50 ml-9" style={{ fontFamily: 'Outfit' }}>
          {subtitle}
        </p>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  );
}

export function Settings() {
  // Modal states
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Account Settings
  const [name, setName] = useState('John Doe');
  const [email] = useState('john.doe@example.com');

  // Notifications & Reminders
  const [followUpReminders, setFollowUpReminders] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [notificationTiming, setNotificationTiming] = useState('1day');

  // Application Preferences
  const [defaultStatus, setDefaultStatus] = useState('saved');
  const [duplicateDetection, setDuplicateDetection] = useState(true);
  const [autoTagging, setAutoTagging] = useState(false);
  const [selectedTags] = useState(['Remote', 'Internship', 'Urgent']);

  // Appearance Settings
  const [accentColor, setAccentColor] = useState('gold');
  const [cardLayout, setCardLayout] = useState('comfortable');
  const { theme, setTheme } = useTheme();

  // Extension Settings
  const [jobPageDetection, setJobPageDetection] = useState(true);
  const [saveJobPopup, setSaveJobPopup] = useState(true);
  const [autoSaveSuggestion, setAutoSaveSuggestion] = useState(false);
  const [extensionNotifications, setExtensionNotifications] = useState(true);
  const [keyboardShortcut, setKeyboardShortcut] = useState('Ctrl+Shift+S');

  return (
    <div className="ml-60 min-h-screen bg-[#E5E5E5] p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1
          className="text-5xl font-bold text-[#14213D] mb-2"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
        >
          Settings
        </h1>
        <p className="text-[#73766A] text-base" style={{ fontFamily: 'Outfit' }}>
          Customize your Mirae experience
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-8 max-w-7xl">
        {/* Left Column */}
        <div className="space-y-8">
          {/* 1. Account Settings */}
          <SectionCard
            icon={<User size={22} />}
            title="Account Settings"
            subtitle="Manage your profile information"
            delay={0.1}
          >
            <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#FCA311] flex items-center justify-center text-[#14213D] text-2xl font-bold shadow-lg">
                  JD
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#14213D] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1a2a4f] transition-colors border-2 border-white"
                >
                  <Camera size={14} className="text-[#FCA311]" />
                </motion.button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#14213D]" style={{ fontFamily: 'Outfit' }}>
                  {name}
                </h3>
                <p className="text-sm text-[#14213D]/50" style={{ fontFamily: 'Outfit' }}>
                  {email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#14213D] mb-2" style={{ fontFamily: 'Outfit' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:ring-opacity-30 focus:border-[#FCA311] text-[#14213D] transition-all shadow-sm hover:border-gray-300"
                  style={{ fontFamily: 'Outfit' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#14213D] mb-2" style={{ fontFamily: 'Outfit' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-[#14213D]/50 cursor-not-allowed"
                  style={{ fontFamily: 'Outfit' }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowChangePasswordModal(true)}
                className="w-full px-4 py-3 bg-[#14213D] text-white rounded-lg hover:bg-[#1a2a4f] transition-all flex items-center justify-center gap-2 font-medium shadow-md"
                style={{ fontFamily: 'Outfit' }}
              >
                <Lock size={18} />
                Change Password
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full px-4 py-3 border-2 border-[#FCA311] text-[#FCA311] rounded-lg hover:bg-[#FCA311] hover:text-white transition-all flex items-center justify-center gap-2 font-medium"
                style={{ fontFamily: 'Outfit' }}
              >
                <Upload size={18} />
                Upload Profile Picture
              </motion.button>
            </div>
          </SectionCard>

          {/* 2. Notifications & Reminders */}
          <SectionCard
            icon={<Bell size={22} />}
            title="Notifications & Reminders"
            subtitle="Control alerts and follow-ups"
            delay={0.2}
          >
            <div className="space-y-1 pb-4 mb-4 border-b border-gray-100">
              <ToggleSwitch
                label="Follow-up reminders"
                checked={followUpReminders}
                onCheckedChange={setFollowUpReminders}
              />
              <ToggleSwitch
                label="Deadline alerts"
                checked={deadlineAlerts}
                onCheckedChange={setDeadlineAlerts}
              />
              <ToggleSwitch
                label="Interview reminders"
                checked={interviewReminders}
                onCheckedChange={setInterviewReminders}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-3" style={{ fontFamily: 'Outfit' }}>
                Notification Timing
              </label>
              <RadioGroup.Root value={notificationTiming} onValueChange={setNotificationTiming} className="space-y-2">
                <div className="flex items-center gap-3">
                  <RadioGroup.Item
                    value="1day"
                    className="w-5 h-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-[#FCA311] outline-none cursor-pointer transition-all"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-[#FCA311]" />
                  </RadioGroup.Item>
                  <label className="text-[#14213D] cursor-pointer" style={{ fontFamily: 'Outfit' }}>
                    1 day before
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroup.Item
                    value="3days"
                    className="w-5 h-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-[#FCA311] outline-none cursor-pointer transition-all"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-[#FCA311]" />
                  </RadioGroup.Item>
                  <label className="text-[#14213D] cursor-pointer" style={{ fontFamily: 'Outfit' }}>
                    3 days before
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroup.Item
                    value="custom"
                    className="w-5 h-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-[#FCA311] outline-none cursor-pointer transition-all"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-[#FCA311]" />
                  </RadioGroup.Item>
                  <label className="text-[#14213D] cursor-pointer" style={{ fontFamily: 'Outfit' }}>
                    Custom timing
                  </label>
                </div>
              </RadioGroup.Root>
            </div>
          </SectionCard>

          {/* 3. Application Preferences */}
          <SectionCard
            icon={<Briefcase size={22} />}
            title="Application Preferences"
            subtitle="Default behavior for new applications"
            delay={0.3}
          >
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-3" style={{ fontFamily: 'Outfit' }}>
                Default Status
              </label>
              <RadioGroup.Root value={defaultStatus} onValueChange={setDefaultStatus} className="space-y-2 mb-5">
                <div className="flex items-center gap-3">
                  <RadioGroup.Item
                    value="saved"
                    className="w-5 h-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-[#FCA311] outline-none cursor-pointer transition-all"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-[#FCA311]" />
                  </RadioGroup.Item>
                  <label className="text-[#14213D] cursor-pointer" style={{ fontFamily: 'Outfit' }}>
                    Saved
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroup.Item
                    value="applied"
                    className="w-5 h-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-[#FCA311] outline-none cursor-pointer transition-all"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-[#FCA311]" />
                  </RadioGroup.Item>
                  <label className="text-[#14213D] cursor-pointer" style={{ fontFamily: 'Outfit' }}>
                    Applied
                  </label>
                </div>
              </RadioGroup.Root>
            </div>

            <div className="pb-4 mb-4 border-b border-gray-100">
              <label className="block text-sm font-medium text-[#14213D] mb-3" style={{ fontFamily: 'Outfit' }}>
                Quick Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-1.5 bg-[#FCA311] text-white rounded-full text-sm font-medium shadow-sm cursor-pointer"
                    style={{ fontFamily: 'Outfit' }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <ToggleSwitch
                label="Duplicate detection"
                checked={duplicateDetection}
                onCheckedChange={setDuplicateDetection}
              />
              <ToggleSwitch
                label="Auto-tagging"
                checked={autoTagging}
                onCheckedChange={setAutoTagging}
              />
            </div>
          </SectionCard>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* 4. Appearance Settings */}
          <SectionCard
            icon={<Palette size={22} />}
            title="Appearance Settings"
            subtitle="Customize look and feel"
            delay={0.1}
          >
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#14213D] mb-3" style={{ fontFamily: 'Outfit' }}>
                Theme
              </label>
              <ToggleGroup.Root
                type="single"
                value={theme}
                onValueChange={(value) => {
                  if (value === 'light' || value === 'dark') {
                    setTheme(value);
                  }
                }}
                className="inline-flex bg-gray-100 rounded-lg p-1 w-full"
              >
                <ToggleGroup.Item
                  value="light"
                  className="flex-1 px-4 py-2.5 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-[#14213D] text-[#14213D]/50 transition-all font-medium"
                  style={{ fontFamily: 'Outfit' }}
                >
                  Light
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="dark"
                  className="flex-1 px-4 py-2.5 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-[#14213D] text-[#14213D]/50 transition-all font-medium"
                  style={{ fontFamily: 'Outfit' }}
                >
                  Dark
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#14213D] mb-3" style={{ fontFamily: 'Outfit' }}>
                Accent Color
              </label>
              <ToggleGroup.Root
                type="single"
                value={accentColor}
                onValueChange={(value) => value && setAccentColor(value)}
                className="inline-flex bg-gray-100 rounded-lg p-1 w-full"
              >
                <ToggleGroup.Item
                  value="gold"
                  className="flex-1 px-4 py-2.5 rounded-md data-[state=on]:bg-[#FCA311] data-[state=on]:text-white data-[state=on]:shadow-md text-[#14213D]/50 transition-all font-semibold"
                  style={{ fontFamily: 'Outfit' }}
                >
                  Gold
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="soft-gold"
                  className="flex-1 px-4 py-2.5 rounded-md data-[state=on]:bg-[#E8B923] data-[state=on]:text-white data-[state=on]:shadow-md text-[#14213D]/50 transition-all font-semibold"
                  style={{ fontFamily: 'Outfit' }}
                >
                  Soft Gold
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-3" style={{ fontFamily: 'Outfit' }}>
                Card Layout
              </label>
              <RadioGroup.Root value={cardLayout} onValueChange={setCardLayout} className="space-y-2">
                <div className="flex items-center gap-3">
                  <RadioGroup.Item
                    value="compact"
                    className="w-5 h-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-[#FCA311] outline-none cursor-pointer transition-all"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-[#FCA311]" />
                  </RadioGroup.Item>
                  <label className="text-[#14213D] cursor-pointer" style={{ fontFamily: 'Outfit' }}>
                    Compact
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroup.Item
                    value="comfortable"
                    className="w-5 h-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-[#FCA311] outline-none cursor-pointer transition-all"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-[#FCA311]" />
                  </RadioGroup.Item>
                  <label className="text-[#14213D] cursor-pointer" style={{ fontFamily: 'Outfit' }}>
                    Comfortable
                  </label>
                </div>
              </RadioGroup.Root>
            </div>
          </SectionCard>

          {/* 5. Extension Settings */}
          <SectionCard
            icon={<Chrome size={22} />}
            title="Extension Settings"
            subtitle="Control browser extension behavior"
            delay={0.2}
          >
            <div className="space-y-1 pb-4 mb-4 border-b border-gray-100">
              <ToggleSwitch
                label="Enable job page detection"
                checked={jobPageDetection}
                onCheckedChange={setJobPageDetection}
              />
              <ToggleSwitch
                label='Show "Save Job" popup'
                checked={saveJobPopup}
                onCheckedChange={setSaveJobPopup}
              />
              <ToggleSwitch
                label="Enable auto-save suggestion"
                checked={autoSaveSuggestion}
                onCheckedChange={setAutoSaveSuggestion}
              />
              <ToggleSwitch
                label="Enable extension notifications"
                checked={extensionNotifications}
                onCheckedChange={setExtensionNotifications}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-2" style={{ fontFamily: 'Outfit' }}>
                Keyboard Shortcut
              </label>
              <input
                type="text"
                value={keyboardShortcut}
                onChange={(e) => setKeyboardShortcut(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:ring-opacity-30 focus:border-[#FCA311] text-[#14213D] font-mono transition-all shadow-sm hover:border-gray-300"
              />
            </div>
          </SectionCard>

          {/* 6. Privacy & Security */}
          <SectionCard
            icon={<Shield size={22} />}
            title="Privacy & Security"
            subtitle="Manage account and data security"
            delay={0.3}
          >
            <div className="space-y-1">
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setShowLogoutModal(true)}
                className="w-full px-4 py-3 text-left text-[#14213D] hover:bg-gray-50 rounded-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} className="text-[#14213D]" />
                  <span style={{ fontFamily: 'Outfit' }}>Logout from all devices</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#14213D] transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                className="w-full px-4 py-3 text-left text-[#14213D] hover:bg-gray-50 rounded-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-[#14213D]" />
                  <span style={{ fontFamily: 'Outfit' }}>Two-factor authentication</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#14213D] transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                className="w-full px-4 py-3 text-left text-[#14213D] hover:bg-gray-50 rounded-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Download size={18} className="text-[#14213D]" />
                  <span style={{ fontFamily: 'Outfit' }}>Data backup/export (CSV)</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#14213D] transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setShowDeleteAccountModal(true)}
                className="w-full px-4 py-3 text-left text-[#DC6B6B] hover:bg-red-50 rounded-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <UserX size={18} className="text-[#DC6B6B]" />
                  <span style={{ fontFamily: 'Outfit' }}>Delete account</span>
                </div>
                <ChevronRight size={16} className="text-red-300 group-hover:text-[#DC6B6B] transition-colors" />
              </motion.button>
            </div>
          </SectionCard>

          {/* 7. Danger Zone */}
          <SectionCard
            icon={<AlertTriangle size={22} />}
            title="Danger Zone"
            subtitle="These actions cannot be undone"
            danger
            delay={0.4}
          >
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full px-4 py-3 bg-[#DC6B6B] text-white rounded-lg hover:bg-[#c95555] transition-all flex items-center justify-center gap-2 font-medium shadow-md"
                style={{ fontFamily: 'Outfit' }}
              >
                <UserX size={18} />
                Delete All Application Data
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowResetModal(true)}
                className="w-full px-4 py-3 border-2 border-[#DC6B6B] text-[#DC6B6B] rounded-lg hover:bg-[#DC6B6B] hover:text-white transition-all flex items-center justify-center gap-2 font-medium"
                style={{ fontFamily: 'Outfit' }}
              >
                <RotateCcw size={18} />
                Reset Settings to Default
              </motion.button>
            </div>

            <p className="text-sm text-[#DC6B6B]/70 mt-4 italic text-center" style={{ fontFamily: 'Outfit' }}>
              Warning: These actions cannot be undone
            </p>
          </SectionCard>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePasswordModal && (
          <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <ConfirmationModal
            title="Logout from All Devices"
            message="Are you sure you want to log out from all devices? You will need to sign in again on each device."
            confirmText="Yes, Logout"
            onClose={() => setShowLogoutModal(false)}
            onConfirm={() => {
              // Handle logout
              setShowLogoutModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteAccountModal && (
          <ConfirmationModal
            title="Delete Account"
            message="Are you absolutely sure? This action cannot be undone. All your application data, resumes, and account information will be permanently deleted."
            confirmText="Yes, Delete Account"
            onClose={() => setShowDeleteAccountModal(false)}
            onConfirm={() => {
              // Handle delete account
              setShowDeleteAccountModal(false);
            }}
            danger
          />
        )}
      </AnimatePresence>

      {/* Reset Settings Modal */}
      <AnimatePresence>
        {showResetModal && (
          <ConfirmationModal
            title="Reset Settings to Default"
            message="This will reset all your preferences and settings to their default values. Your application data will not be affected."
            confirmText="Yes, Reset"
            onClose={() => setShowResetModal(false)}
            onConfirm={() => {
              // Handle reset
              setShowResetModal(false);
            }}
            danger
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Change Password Modal Component
interface ChangePasswordModalProps {
  onClose: () => void;
}

function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    // Handle password change
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0B132B] bg-opacity-60 z-[99999] flex items-center justify-center p-8"
        style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
      >
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative z-[100000]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
            <h2
              className="text-2xl font-bold text-[#14213D]"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
            >
              Change Password
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-[#FCA311] hover:text-[#fdb748] transition-colors p-1"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#14213D] mb-2" style={{ fontFamily: 'Outfit' }}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:ring-opacity-30 focus:border-[#FCA311] text-[#14213D] transition-all pr-12"
                  style={{ fontFamily: 'Outfit' }}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#14213D] transition-colors"
                >
                  {showCurrent ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#14213D] mb-2" style={{ fontFamily: 'Outfit' }}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:ring-opacity-30 focus:border-[#FCA311] text-[#14213D] transition-all pr-12"
                  style={{ fontFamily: 'Outfit' }}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#14213D] transition-colors"
                >
                  {showNew ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#14213D] mb-2" style={{ fontFamily: 'Outfit' }}>
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:ring-opacity-30 focus:border-[#FCA311] text-[#14213D] transition-all pr-12"
                  style={{ fontFamily: 'Outfit' }}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#14213D] transition-colors"
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 text-[#14213D] font-semibold hover:text-[#FCA311] transition-colors"
              style={{ fontFamily: 'Outfit' }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="px-6 py-3 bg-[#FCA311] text-[#000000] rounded-lg font-bold hover:bg-[#fdb748] transition-all shadow-md hover:shadow-lg"
              style={{ fontFamily: 'Outfit' }}
            >
              Update Password
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// Confirmation Modal Component
interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText: string;
  onClose: () => void;
  onConfirm: () => void;
  danger?: boolean;
}

function ConfirmationModal({ title, message, confirmText, onClose, onConfirm, danger }: ConfirmationModalProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0B132B] bg-opacity-60 z-[99999] flex items-center justify-center p-8"
        style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
      >
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative z-[100000]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
            <h2
              className={`text-2xl font-bold ${danger ? 'text-[#DC6B6B]' : 'text-[#14213D]'}`}
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
            >
              {title}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`${danger ? 'text-[#DC6B6B] hover:text-[#c95555]' : 'text-[#FCA311] hover:text-[#fdb748]'} transition-colors p-1`}
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-[#73766A] text-base leading-relaxed" style={{ fontFamily: 'Outfit' }}>
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 text-[#14213D] font-semibold hover:text-[#FCA311] transition-colors"
              style={{ fontFamily: 'Outfit' }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className={`px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${
                danger
                  ? 'bg-[#DC6B6B] text-white hover:bg-[#c95555]'
                  : 'bg-[#FCA311] text-[#000000] hover:bg-[#fdb748]'
              }`}
              style={{ fontFamily: 'Outfit' }}
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
