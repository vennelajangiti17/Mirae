import { X, MapPin, Calendar, FileText, File, Clock, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Application {
  id: string;
  company: string;
  role: string;
  matchScore: number | null;
  appliedDate: string;
  stage: string;
  companyAcronym: string;
  imageUrl: string;
  url: string;
  location: string;
  postedDate: string;
  salaryRange: string;
  description: string;
  skills: {
    all: string[];
    matched: string[];
    missing: string[];
  };
}

interface Props {
  application: Application;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: string) => void;
}

export function ApplicationDetail({ application, onClose, onStatusChange }: Props) {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState(application.stage || 'Saved');

  const tabs = ['Overview', 'Timeline & Prep', 'Notes', 'Documents'];

  const { skills, description = 'No description available.', location, postedDate, salaryRange, matchScore } = application;
  const { all = [], matched = [], missing = {} as any } = skills || {};
  const missingArray = Array.isArray(missing) ? missing : [];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(application.id, newStatus);
    }
  };

  const handleDownloadWayback = () => {
    const element = document.createElement("a");
    const file = new Blob([`Title: ${application.role}\nCompany: ${application.company}\nURL: ${application.url}\n\nDescription:\n${description}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${application.company}_${application.role.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_archived.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toxicPhrases = ["wear many hats", "fast-paced family", "work hard play hard", "rockstar", "ninja", "hit the ground running", "self-starter"];
  const renderDescriptionWithRedFlags = (desc: string) => {
    let highlightedDesc = desc;
    toxicPhrases.forEach(phrase => {
      const regex = new RegExp(`(${phrase})`, "gi");
      highlightedDesc = highlightedDesc.replace(regex, '<span class="bg-red-100 text-red-800 font-bold px-1 rounded" title="Potential Red Flag: Toxic Culture indicator">$1</span>');
    });
    return <div dangerouslySetInnerHTML={{ __html: highlightedDesc }} />;
  };

  return (
    <>
      {/* 1. UI & Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-screen w-[600px] bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#14213D] p-6 sticky top-0 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {application.role}
              </h2>
              <div className="flex items-center gap-3">
                <p className="text-[#E5E5E5] text-lg flex items-center gap-2">
                  {application.company}
                  {/* Quick-Search Links */}
                  <a href={`https://www.glassdoor.com/Search/results.htm?keyword=${encodeURIComponent(application.company)}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#FCA311] transition-colors" title="Search Salaries on Glassdoor">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 0h-9v24h9V0zm-7 2h5v20h-5V2z"/></svg>
                  </a>
                  <a href={`https://www.levels.fyi/companies/${application.company.toLowerCase().replace(/[^a-z0-9]/g, '')}/salaries`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#FCA311] transition-colors" title="Search on Levels.fyi">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 2h20v20H2z"/></svg>
                  </a>
                </p>
                {/* Wayback Archiver */}
                <button onClick={handleDownloadWayback} className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded ml-2 transition-colors flex items-center gap-1" title="Download raw job description">
                  <FileText className="w-3 h-3" /> Save Archive
                </button>
              </div>
              
              {/* 3. Header Details (Dynamic Data) */}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{location || 'Location Not specified'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{postedDate || 'Date Not specified'}</span>
                </div>
                {salaryRange && (
                  <div className="flex items-center gap-1 bg-[#FCA311]/20 text-[#FCA311] px-2 py-0.5 rounded font-medium">
                    <span>{salaryRange}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* 2. Status Dropdown (Actionable) */}
              <select
                value={status}
                onChange={handleStatusChange}
                className="px-4 py-2 bg-[#FCA311] text-[#000000] rounded-md font-semibold hover:bg-[#fdb748] transition-all cursor-pointer outline-none appearance-none pr-8 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
              >
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
              
              <button onClick={onClose} className="text-white hover:text-[#FCA311] transition-colors p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[rgba(252,163,17,0.2)] mt-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(/ & /g, '-'))}
                className={`pb-3 text-sm font-medium transition-all relative ${
                  activeTab === tab.toLowerCase().replace(/ & /g, '-')
                    ? 'text-[#FCA311]'
                    : 'text-[#E5E5E5] hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase().replace(/ & /g, '-') && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCA311]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {/* 4. Tab 1: Overview (Dynamic Mapping) */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex-1 mr-8">
                  <h3 className="text-lg font-bold text-[#000000] mb-3">AI Skill Gap Analysis</h3>
                  
                  {/* Matched Skills */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Matched Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {matched.length > 0 ? (
                        matched.map((skill, i) => (
                          <span key={i} className="px-3 py-1.5 bg-[#14213D] text-white rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">No matched skills found.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-600">Missing Skills</p>
                      {missingArray.length > 0 && (
                        <button className="text-xs text-[#FCA311] hover:underline font-medium">✨ Generate Pivot Script</button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missingArray.length > 0 ? (
                        missingArray.map((skill: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">No missing skills found!</span>
                      )}
                    </div>
                  </div>
                  
                  {/* All Required Skills */}
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">All Required</p>
                    <div className="flex flex-wrap gap-2">
                      {all.length > 0 ? (
                        all.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">No skills specified.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Circular Match Score */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                    <circle
                      cx="64" cy="64" r="56" stroke="#FCA311" strokeWidth="12" fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - (matchScore ?? 0) / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#FCA311]">{matchScore !== null ? `${matchScore}%` : 'N/A'}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Match</span>
                  </div>
                </div>
              </div>

              {/* Job Description Box */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#000000]">Description</h3>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium border border-red-200">
                    🚩 Red Flags Detected
                  </span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {renderDescriptionWithRedFlags(description)}
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. Other Tabs (Mock UI) */}
          
          {/* Timeline & Prep */}
          {activeTab === 'timeline-prep' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
              <h3 className="text-lg font-bold text-[#000000] mb-6">Application Journey</h3>
              
              <div className="relative pl-6 border-l-2 border-[#14213D] space-y-8 mb-10 ml-4">
                <div className="relative">
                  <div className="absolute -left-[31px] bg-white p-1 rounded-full"><Clock className="w-4 h-4 text-[#14213D]" /></div>
                  <p className="font-bold text-[#14213D]">Next Step: Follow-up</p>
                  <button className="text-xs text-[#FCA311] hover:underline mt-1">Snooze for 7 days</button>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] bg-[#14213D] p-1 rounded-full"><Clock className="w-4 h-4 text-white" /></div>
                  <p className="font-bold text-[#14213D]">Saved to Mirae</p>
                  <p className="text-sm text-gray-500">{application.appliedDate}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#000000] mb-4">Auto-Checklist</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-[#FCA311]" /> Tailor Resume</label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-[#FCA311]" /> Find Referral on LinkedIn</label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-[#FCA311]" /> Submit Application</label>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#000000] mb-4">Interview Prep</h3>
              <button className="w-full py-4 border-2 border-dashed border-[#FCA311] rounded-lg text-[#FCA311] font-bold hover:bg-[#FCA311]/10 transition-colors flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Custom Mock Interview
              </button>
            </motion.div>
          )}

          {/* Notes */}
          {activeTab === 'notes' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#000000]">Networking CRM</h3>
                <a href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(application.company)}%20IIT%20Patna`} target="_blank" rel="noreferrer" className="text-xs bg-[#0A66C2] text-white px-3 py-1.5 rounded font-medium hover:bg-[#004182] transition-colors">
                  🔍 Find IIT Patna Alumni
                </a>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Recruiter Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FCA311]" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Hiring Manager</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FCA311]" placeholder="John Smith" />
                </div>
              </div>

              <div className="mb-4">
                <button className="w-full py-2 bg-[#FCA311]/20 text-[#FCA311] font-bold rounded-lg hover:bg-[#FCA311]/30 transition-colors text-sm">
                  ✨ Draft Smart Cold Message
                </button>
              </div>

              <h3 className="text-lg font-bold text-[#000000] mb-2 mt-4">Rich Text Scratchpad</h3>
              <textarea 
                className="flex-1 w-full border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:border-transparent text-sm"
                placeholder="Write down any details, contacts, or thoughts about this application..."
              />
              <button className="mt-4 bg-[#14213D] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0B132B] transition-colors self-end">
                Save Note
              </button>
            </motion.div>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#000000]">Asset Library</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Version: Frontend_Resume_v2.pdf</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#14213D] hover:bg-gray-50 transition-colors h-40">
                  <FileText className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="font-bold text-[#14213D]">Upload Resume</p>
                  <p className="text-xs text-gray-500 mt-1">Specific to this job</p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#14213D] hover:bg-gray-50 transition-colors h-40 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#FCA311]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button className="text-white font-bold text-sm bg-black/20 px-4 py-2 rounded">✨ Generate Cover Letter</button>
                  </div>
                  <File className="w-8 h-8 text-gray-400 mb-2 group-hover:blur-sm transition-all" />
                  <p className="font-bold text-[#14213D] group-hover:blur-sm transition-all">Cover Letter</p>
                  <p className="text-xs text-gray-500 mt-1 group-hover:blur-sm transition-all">PDF or Word</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-3">✨ Resume Bullet Tailorer</h3>
                <p className="text-xs text-gray-500 mb-2">Paste a generic bullet point, and Groq will rewrite it to include keywords from the job description.</p>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-[#FCA311] text-sm h-24 mb-2"
                  placeholder="e.g., Built a web app using React and Node.js..."
                />
                <button className="w-full py-2 bg-[#14213D] text-white font-bold rounded-lg hover:bg-[#0B132B] transition-colors text-sm">
                  Tailor Bullet Point
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </>
  );
}
