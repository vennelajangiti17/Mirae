import { Search, Plus, Paperclip, ExternalLink, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApplicationDetail } from './ApplicationDetail';
import { AddManualModal } from './AddManualModal';
import { getDashboardSummary, getRecentJobs } from '../services/dashboardService';

interface Application {
  id: string;
  company: string;
  role: string;
  matchScore: number | null;
  appliedDate: string;
  stage: string;
  companyAcronym: string;
  imageUrl: string;
  description: string;
  matchedSkills: string[];
  missingSkills: string[];
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString();
};

const getCompanyAcronym = (company: string) =>
  company
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// Try to get a real company logo from the job URL domain
const getCompanyLogoUrl = (job: any): string => {
  try {
    if (job.url && job.url.startsWith('http')) {
      const hostname = new URL(job.url).hostname.replace('www.', '');
      // Use logo.clearbit.com for real logos (e.g. amazon.jobs → amazon.com logo)
      const domain = hostname.includes('.jobs') 
        ? hostname.replace('.jobs', '.com')
        : hostname;
      return `https://logo.clearbit.com/${domain}`;
    }
  } catch {}
  // Fallback: styled initials avatar
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    job.company || 'Company'
  )}&background=14213D&color=FCA311&size=256&bold=true&font-size=0.4`;
};

const mapJobToApplication = (job: any): Application => ({
  id: job._id,
  company: job.company || 'Unknown Company',
  role: job.title || 'Untitled Role',
  matchScore: job.matchScore ?? null,
  appliedDate: formatDate(job.appliedDate || job.createdAt),
  stage: job.status || 'Saved',
  companyAcronym: getCompanyAcronym(job.company || 'UC'),
  imageUrl: getCompanyLogoUrl(job),
  description: job.description || 'No job description provided.',
  matchedSkills: job.matchedSkills || [],
  missingSkills: job.missingSkills || [],
});

export function Dashboard() {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'hackathons' | 'others'>(
    'jobs'
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        console.log('[Dashboard] Loading... Token:', localStorage.getItem('token')?.substring(0, 20) + '...');
        const [summaryData, recentJobs] = await Promise.all([
          getDashboardSummary(),
          getRecentJobs(),
        ]);

        console.log('[Dashboard] Summary:', summaryData);
        console.log('[Dashboard] Recent jobs count:', recentJobs?.length);

        setSummary(summaryData);
        setApplications((recentJobs || []).map(mapJobToApplication));
      } catch (error) {
        console.error('[Dashboard] Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Sync token with extension when dashboard loads
    const token = localStorage.getItem('token');
    if (token) {
      window.postMessage({ type: "MIRAE_SYNC_TOKEN", token }, "*");
    }

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    navigate('/', { replace: true });
  };

  const savedApps = useMemo(
    () => applications.filter((app) => app.stage === 'Saved'),
    [applications]
  );

  const appliedApps = useMemo(
    () =>
      applications.filter(
        (app) => app.stage === 'Applied' || app.stage === 'Interviewing'
      ),
    [applications]
  );

  const offerApps = useMemo(
    () => applications.filter((app) => app.stage === 'Offer'),
    [applications]
  );

  const rejectedApps = useMemo(
    () => applications.filter((app) => app.stage === 'Rejected'),
    [applications]
  );

  const renderCard = (
    app: Application,
    index: number,
    variant: 'default' | 'selected' | 'rejected' = 'default'
  ) => (
    <motion.div
      key={app.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => setSelectedApp(app)}
      className={`bg-white rounded-md overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(252,163,17,0.2)] transition-all duration-300 cursor-pointer group ${
        variant === 'rejected' ? 'opacity-60 grayscale-[0.3]' : ''
      } ${
        variant === 'selected'
          ? 'border-2 border-[#FCA311] ring-2 ring-[#FCA311] ring-opacity-20'
          : ''
      }`}
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={app.imageUrl}
          alt={app.company}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to initials avatar if logo fails to load
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.company)}&background=14213D&color=FCA311&size=256&bold=true&font-size=0.4`;
          }}
        />
        <div className="absolute top-3 right-3 w-10 h-10 bg-[#14213D] rounded-md flex items-center justify-center text-white font-bold text-sm shadow-md">
          {app.companyAcronym}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-[#000000] text-lg mb-1 leading-tight">
              {app.role}
            </h3>
            <p className="text-sm text-[#14213D]">{app.company}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-[#14213D] opacity-40 hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
        </div>

        <div className="flex items-center justify-between mt-4 gap-2">
          <div
            className={`px-3 py-1 rounded text-xs font-semibold ${
              variant === 'selected'
                ? 'bg-[#059669] text-white'
                : variant === 'rejected'
                ? 'bg-[#E5E5E5] text-[#14213D] opacity-50'
                : 'bg-[#d4f4dd] text-[#16a34a]'
            }`}
          >
            {variant === 'selected'
              ? 'Offer Received!'
              : app.matchScore !== null
              ? `${app.matchScore}% Match`
              : 'Add resume for Match Score'}
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
      <div className="bg-white border-b border-[#E5E5E5] px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <div className="min-w-0">
              <h1
                className="text-3xl font-bold text-[#000000]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Dashboard
              </h1>
              <p className="text-sm text-[#14213D] opacity-70">
                Manage your pipeline and momentum.
              </p>
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

      <div className="p-8">
        <div className="mb-6 text-sm text-[#14213D]">
          {loading
            ? 'Loading dashboard...'
            : `Total Jobs: ${summary?.totalJobs ?? 0} | Saved: ${summary?.saved ?? 0} | Applied: ${summary?.applied ?? 0} | Interviewing: ${summary?.interviewing ?? 0} | Offers: ${summary?.offers ?? 0} | Rejected: ${summary?.rejected ?? 0}`}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2
            className="text-3xl font-bold text-[#000000] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Saved ({savedApps.length})
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {savedApps.map((app, index) => renderCard(app, index))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12"
        >
          <h2
            className="text-3xl font-bold text-[#000000] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Applied / Interviewing ({appliedApps.length})
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {appliedApps.map((app, index) => renderCard(app, index))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-12"
        >
          <h2
            className="text-3xl font-bold text-[#000000] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Offers ({offerApps.length})
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {offerApps.map((app, index) => renderCard(app, index, 'selected'))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <h2
            className="text-3xl font-bold text-[#000000] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Rejected ({rejectedApps.length})
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {rejectedApps.map((app, index) =>
              renderCard(app, index, 'rejected')
            )}
          </div>
        </motion.div>
      </div>

      {selectedApp && (
        <ApplicationDetail
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      {showAddModal && <AddManualModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
