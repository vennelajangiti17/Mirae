import { Search, Plus, Paperclip, ExternalLink, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ApplicationDetail } from './ApplicationDetail';
import { AddManualModal } from './AddManualModal';

interface Application {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  appliedDate: string;
  stage: string;
  companyAcronym: string;
  imageUrl: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    matchScore: 92,
    appliedDate: '2d ago',
    stage: 'Saved',
    companyAcronym: 'ST',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    company: 'Vercel',
    role: 'Full Stack Developer',
    matchScore: 88,
    appliedDate: '3d ago',
    stage: 'Saved',
    companyAcronym: 'VE',
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    company: 'Acme Corp',
    role: 'Full-Stack Developer',
    matchScore: 82,
    appliedDate: '2d ago',
    stage: 'Applied',
    companyAcronym: 'AC',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop'
  },
  {
    id: '4',
    company: 'TechFlow',
    role: 'Backend Engineer',
    matchScore: 79,
    appliedDate: '4d ago',
    stage: 'Applied',
    companyAcronym: 'TF',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=200&fit=crop'
  },
  {
    id: '5',
    company: 'DataCo',
    role: 'Platform Engineer',
    matchScore: 76,
    appliedDate: '6d ago',
    stage: 'Applied',
    companyAcronym: 'DC',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop'
  },
  {
    id: '6',
    company: 'GitHub',
    role: 'Software Engineer',
    matchScore: 94,
    appliedDate: '1d ago',
    stage: 'Selected',
    companyAcronym: 'GH',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=200&fit=crop'
  },
  {
    id: '7',
    company: 'StartupX',
    role: 'Product Engineer',
    matchScore: 65,
    appliedDate: '1w ago',
    stage: 'Rejected',
    companyAcronym: 'SX',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop'
  }
];

export function Dashboard() {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'hackathons' | 'others'>('jobs');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const savedApps = mockApplications.filter(app => app.stage === 'Saved');
  const appliedApps = mockApplications.filter(app => app.stage === 'Applied');
  const selectedApps = mockApplications.filter(app => app.stage === 'Selected');
  const rejectedApps = mockApplications.filter(app => app.stage === 'Rejected');

  const handleLogout = () => {
    window.localStorage.removeItem('isLoggedIn');
    navigate('/', { replace: true });
  };

  const renderCard = (app: Application, index: number, variant: 'default' | 'selected' | 'rejected' = 'default') => (
    <motion.div
      key={app.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => setSelectedApp(app)}
      className={`bg-white rounded-md overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(252,163,17,0.2)] transition-all duration-300 cursor-pointer group ${
        variant === 'rejected' ? 'opacity-60 grayscale-[0.3]' : ''
      } ${
        variant === 'selected' ? 'border-2 border-[#FCA311] ring-2 ring-[#FCA311] ring-opacity-20' : ''
      }`}
    >
      <div className="relative h-28 overflow-hidden">
        <img src={app.imageUrl} alt={app.company} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 right-3 w-10 h-10 bg-[#14213D] rounded-md flex items-center justify-center text-white font-bold text-sm shadow-md">
          {app.companyAcronym}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-[#000000] text-lg mb-1 leading-tight">{app.role}</h3>
            <p className="text-sm text-[#14213D]">{app.company}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-[#14213D] opacity-40 hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
        </div>
        <div className="flex items-center justify-between mt-4 gap-2">
          <div className={`px-3 py-1 rounded text-xs font-semibold ${
            variant === 'selected'
              ? 'bg-[#059669] text-white'
              : variant === 'rejected'
              ? 'bg-[#E5E5E5] text-[#14213D] opacity-50'
              : 'bg-[#d4f4dd] text-[#16a34a]'
          }`}>
            {variant === 'selected' ? 'Offer Received!' : `${app.matchScore}% Match`}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#14213D] opacity-60">
            <Clock className="w-3 h-3" />
            <span>{app.appliedDate}</span>
          </div>
          <Paperclip className="w-4 h-4 text-[#14213D] opacity-40 flex-shrink-0" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="ml-60 min-h-screen bg-[#E5E5E5]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#E5E5E5] px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-[#000000]" style={{ fontFamily: 'var(--font-display)' }}>
                Dashboard
              </h1>
              <p className="text-sm text-[#14213D] opacity-70">Manage your pipeline and momentum.</p>
            </div>
            <div className="relative hidden max-w-2xl flex-1 md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#14213D] opacity-50" />
              <input
                type="text"
                placeholder="Search applications... CMD+K"
                className="w-full rounded-md border border-[#E5E5E5] bg-white py-3 pl-12 pr-4 text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
              />
            </div>
          </div>
          <div className="ml-6 flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="rounded-md border border-[#E5E5E5] px-5 py-3 font-semibold text-[#14213D] transition-colors hover:border-[#FCA311] hover:text-[#FCA311]"
            >
              Logout
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-md bg-[#FCA311] px-6 py-3 font-semibold text-[#000000] shadow-md transition-all hover:bg-[#fdb748] hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Manual
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white border-b border-[#E5E5E5] px-8 sticky top-[88px] z-10">
        <div className="flex gap-8">
          {(['jobs', 'hackathons', 'others'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 relative transition-all ${
                activeTab === tab
                  ? 'text-[#000000] font-bold'
                  : 'text-[#14213D] opacity-60 hover:opacity-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#000000]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Saved Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#000000] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Saved ({savedApps.length})
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {savedApps.map((app, index) => renderCard(app, index))}
          </div>
        </motion.div>

        {/* Applied Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#000000] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Applied ({appliedApps.length})
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {appliedApps.map((app, index) => renderCard(app, index))}
          </div>
        </motion.div>

        {/* Selected Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#000000] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Selected ({selectedApps.length})
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {selectedApps.map((app, index) => renderCard(app, index, 'selected'))}
          </div>
        </motion.div>

        {/* Rejected Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-[#000000] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Rejected ({rejectedApps.length})
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {rejectedApps.map((app, index) => renderCard(app, index, 'rejected'))}
          </div>
        </motion.div>
      </div>

      {selectedApp && (
        <ApplicationDetail application={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

      {showAddModal && (
        <AddManualModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
