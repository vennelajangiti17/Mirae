import {
  Search,
  Plus,
  ExternalLink,
  Clock,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApplicationDetail } from './ApplicationDetail';
import { AddManualModal } from './AddManualModal';
import {
  deleteDashboardJob,
  getDashboardSummary,
  getRecentJobs,
} from '../services/dashboardService';

type DashboardTab = 'jobs' | 'hackathons' | 'others';
type CardVariant = 'default' | 'selected' | 'rejected';

interface Application {
  id: string;
  company: string;
  role: string;
  matchScore: number | null;
  appliedDate: string;
  stage: string;
  category: string;
  companyAcronym: string;
  imageUrl: string;
  url: string;
  description: string;
  location: string;
  postedDate: string;
  salaryRange: string;
  skills: {
    all: string[];
    matched: string[];
    missing: string[];
  };
}

interface SectionConfig {
  key: string;
  title: string;
  apps: Application[];
  variant?: CardVariant;
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

// Generate a unique gradient for each company based on its name
const getCompanyGradient = (company: string): string => {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 70%, 35%) 0%, hsl(${h2}, 80%, 25%) 100%)`;
};

// Get the Google favicon URL for a domain
const getCompanyFaviconUrl = (job: any): string => {
  try {
    if (job.url && job.url.startsWith('http')) {
      const hostname = new URL(job.url).hostname;
      return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${hostname}&size=64`;
    }
  } catch {}
  return '';
};

const mapJobToApplication = (job: any): Application => ({
  id: job._id,
  company: job.company || 'Unknown Company',
  role: job.title || 'Untitled Role',
  matchScore: job.matchScore ?? null,
  appliedDate: formatDate(job.appliedDate || job.createdAt),
  stage: job.status || 'Saved',
  category: job.category || 'Jobs',
  companyAcronym: getCompanyAcronym(job.company || 'UC'),
  imageUrl: getCompanyFaviconUrl(job),
  url: job.url || '',
  description: job.description || 'No job description provided.',
  location: job.location || 'Unknown Location',
  postedDate: job.postedDate || 'Unknown Date',
  salaryRange: job.salaryRange || '',
  skills: {
    all: job.skills?.all || [],
    matched: job.skills?.matched || job.matchedSkills || [],
    missing: job.skills?.missing || job.missingSkills || []
  }
});

const buildSummary = (apps: Application[]) => ({
  totalJobs: apps.length,
  saved: apps.filter((app) => app.stage === 'Saved').length,
  applied: apps.filter((app) => app.stage === 'Applied').length,
  interviewing: apps.filter((app) => app.stage === 'Interviewing').length,
  offers: apps.filter((app) => app.stage === 'Offer').length,
  rejected: apps.filter((app) => app.stage === 'Rejected').length,
});

const TAB_LABELS: Record<DashboardTab, string> = {
  jobs: 'Jobs',
  hackathons: 'Hackathons/Contests',
  others: 'Others',
};

export function Dashboard() {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('jobs');
  const [showAddModal, setShowAddModal] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryData, recentJobs] = await Promise.all([
          getDashboardSummary(),
          getRecentJobs(),
        ]);

        setSummary(summaryData);
        setApplications((recentJobs || []).map(mapJobToApplication));
      } catch (error) {
        console.error('[Dashboard] Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      window.postMessage({ type: 'MIRAE_SYNC_TOKEN', token }, '*');
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    const closeMenu = () => setMenuOpenId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    navigate('/', { replace: true });
  };

  const handleDelete = async (appId: string) => {
    const confirmed = window.confirm(
      'Delete this card permanently? This will remove it from the database too.'
    );

    if (!confirmed) return;

    try {
      setDeletingId(appId);
      setMenuOpenId(null);
      await deleteDashboardJob(appId);

      setApplications((currentApps) => {
        const nextApps = currentApps.filter((app) => app.id !== appId);
        setSummary(buildSummary(nextApps));

        if (selectedApp?.id === appId) {
          setSelectedApp(null);
        }

        return nextApps;
      });
    } catch (error) {
      console.error('[Dashboard] Delete error:', error);
      window.alert('Failed to delete card. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredApps = useMemo(() => {
    const categoryMap: Record<DashboardTab, string> = {
      jobs: 'Jobs',
      hackathons: 'Hackathons',
      others: 'Others',
    };

    return applications.filter((app) => app.category === categoryMap[activeTab]);
  }, [applications, activeTab]);

  const activeSummary = useMemo(() => buildSummary(filteredApps), [filteredApps]);

  const jobsSections = useMemo<SectionConfig[]>(
    () => [
      {
        key: 'jobs-saved',
        title: 'Saved',
        apps: filteredApps.filter((app) => app.stage === 'Saved'),
      },
      {
        key: 'jobs-applied',
        title: 'Applied / Interviewing',
        apps: filteredApps.filter(
          (app) => app.stage === 'Applied' || app.stage === 'Interviewing'
        ),
      },
      {
        key: 'jobs-offers',
        title: 'Offers',
        apps: filteredApps.filter((app) => app.stage === 'Offer'),
        variant: 'selected',
      },
      {
        key: 'jobs-rejected',
        title: 'Rejected',
        apps: filteredApps.filter((app) => app.stage === 'Rejected'),
        variant: 'rejected',
      },
    ],
    [filteredApps]
  );

  const hackathonSections = useMemo<SectionConfig[]>(
    () => [
      {
        key: 'hackathons-saved',
        title: 'Saved',
        apps: filteredApps.filter((app) => app.stage === 'Saved'),
      },
      {
        key: 'hackathons-registered',
        title: 'Registered',
        apps: filteredApps.filter((app) => app.stage === 'Applied'),
      },
      {
        key: 'hackathons-in-review',
        title: 'In Review',
        apps: filteredApps.filter((app) => app.stage === 'Interviewing'),
      },
      {
        key: 'hackathons-accepted',
        title: 'Accepted',
        apps: filteredApps.filter((app) => app.stage === 'Offer'),
        variant: 'selected',
      },
      {
        key: 'hackathons-closed',
        title: 'Closed',
        apps: filteredApps.filter((app) => app.stage === 'Rejected'),
        variant: 'rejected',
      },
    ],
    [filteredApps]
  );

  const othersSections = useMemo<SectionConfig[]>(
    () => [
      {
        key: 'others-saved',
        title: 'Saved',
        apps: filteredApps.filter((app) => app.stage === 'Saved'),
      },
      {
        key: 'others-active',
        title: 'Active',
        apps: filteredApps.filter(
          (app) => app.stage === 'Applied' || app.stage === 'Interviewing'
        ),
      },
      {
        key: 'others-completed',
        title: 'Completed',
        apps: filteredApps.filter((app) => app.stage === 'Offer'),
        variant: 'selected',
      },
      {
        key: 'others-closed',
        title: 'Closed',
        apps: filteredApps.filter((app) => app.stage === 'Rejected'),
        variant: 'rejected',
      },
    ],
    [filteredApps]
  );

  const currentSections =
    activeTab === 'jobs'
      ? jobsSections
      : activeTab === 'hackathons'
      ? hackathonSections
      : othersSections;

  const currentSummaryText =
    activeTab === 'jobs'
      ? `Total Jobs: ${activeSummary.totalJobs} | Saved: ${activeSummary.saved} | Applied: ${activeSummary.applied} | Interviewing: ${activeSummary.interviewing} | Offers: ${activeSummary.offers} | Rejected: ${activeSummary.rejected}`
      : activeTab === 'hackathons'
      ? `Total Hackathons/Contests: ${activeSummary.totalJobs} | Saved: ${activeSummary.saved} | Registered: ${activeSummary.applied} | In Review: ${activeSummary.interviewing} | Accepted: ${activeSummary.offers} | Closed: ${activeSummary.rejected}`
      : `Total Others: ${activeSummary.totalJobs} | Saved: ${activeSummary.saved} | Active: ${activeSummary.applied + activeSummary.interviewing} | Completed: ${activeSummary.offers} | Closed: ${activeSummary.rejected}`;

  const renderCard = (
    app: Application,
    index: number,
    variant: CardVariant = 'default'
  ) => (
    <motion.div
      key={app.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => setSelectedApp(app)}
      className={`bg-white rounded-md overflow-visible shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(252,163,17,0.2)] transition-all duration-300 cursor-pointer group ${
        variant === 'rejected' ? 'opacity-60 grayscale-[0.3]' : ''
      } ${
        variant === 'selected'
          ? 'border-2 border-[#FCA311] ring-2 ring-[#FCA311] ring-opacity-20'
          : ''
      }`}
    >
<<<<<<< HEAD
      <div className="relative h-28 overflow-hidden rounded-t-md">
        <img
          src={app.imageUrl}
          alt={app.company}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              app.company
            )}&background=14213D&color=FCA311&size=256&bold=true&font-size=0.4`;
          }}
        />
        <div className="absolute top-3 right-3 w-10 h-10 bg-[#14213D] rounded-md flex items-center justify-center text-white font-bold text-sm shadow-md">
=======
      <div
        className="relative h-28 overflow-hidden flex items-center justify-center"
        style={{ background: getCompanyGradient(app.company) }}
      >
        <span className="text-white/20 font-bold text-5xl tracking-wider select-none">
>>>>>>> BugFixes
          {app.companyAcronym}
        </span>
        <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-md overflow-hidden">
          {app.imageUrl ? (
            <img
              src={app.imageUrl}
              alt={app.company}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                // Hide img and show text fallback
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) parent.innerHTML = `<span class="text-[#14213D] font-bold text-sm">${app.companyAcronym}</span>`;
              }}
            />
          ) : (
            <span className="text-[#14213D] font-bold text-sm">{app.companyAcronym}</span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#000000] text-lg mb-1 leading-tight">
              {app.role}
            </h3>
            <p className="text-sm text-[#14213D]">{app.company}</p>
          </div>
<<<<<<< HEAD
          <a
            href="#"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 ml-2"
          >
            <ExternalLink className="w-4 h-4 text-[#14213D] opacity-40 hover:opacity-100 transition-opacity" />
          </a>
=======
          {app.url && (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 ml-2 p-1 rounded hover:bg-[#FCA311]/10 transition-colors"
              title="Open original job listing"
            >
              <ExternalLink className="w-4 h-4 text-[#14213D] opacity-40 hover:opacity-100 transition-opacity" />
            </a>
          )}
>>>>>>> BugFixes
        </div>

        <div className="flex items-center justify-between mt-4 gap-3">
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
              ? activeTab === 'hackathons'
                ? 'Accepted'
                : activeTab === 'others'
                ? 'Completed'
                : 'Offer Received!'
              : app.matchScore !== null
              ? `${app.matchScore}% Match`
              : activeTab === 'hackathons'
              ? 'Track registration'
              : activeTab === 'others'
              ? 'Keep this handy'
              : 'Add resume for Match Score'}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-[#14213D] opacity-60">
              <Clock className="w-3 h-3" />
              <span>{app.appliedDate}</span>
            </div>

            <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId((current) => (current === app.id ? null : app.id));
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#14213D]"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {menuOpenId === app.id && (
                <div className="absolute bottom-full right-0 z-30 mb-2 min-w-[150px] rounded-md border border-[#E5E5E5] bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDelete(app.id);
                    }}
                    disabled={deletingId === app.id}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-[#B42318] transition hover:bg-[#FDECEC] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === app.id ? 'Deleting...' : 'Delete card'}
                  </button>
                </div>
              )}
            </div>
          </div>
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
                {activeTab === 'jobs'
                  ? 'Manage your job pipeline and momentum.'
                  : activeTab === 'hackathons'
                  ? 'Track the contests you want to join and the ones you have registered for.'
                  : 'Keep track of other opportunities you want to remember.'}
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
          {([
            { value: 'jobs', label: 'Jobs' },
            { value: 'hackathons', label: 'Hackathons/Contests' },
            { value: 'others', label: 'Others' },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`py-4 px-2 relative transition-all ${
                activeTab === tab.value
                  ? 'text-[#000000] font-bold'
                  : 'text-[#14213D] opacity-60 hover:opacity-100'
              }`}
            >
              {tab.label}
              {activeTab === tab.value && (
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
          {loading ? 'Loading dashboard...' : currentSummaryText}
        </div>

        {currentSections.map((section, sectionIndex) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: sectionIndex * 0.12 }}
            className="mb-12"
          >
            <h2
              className="text-3xl font-bold text-[#000000] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {section.title} ({section.apps.length})
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {section.apps.map((app, index) =>
                renderCard(app, index, section.variant || 'default')
              )}
            </div>
          </motion.div>
        ))}
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
