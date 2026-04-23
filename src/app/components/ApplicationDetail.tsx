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

  const { skills, description = 'No description available.', location, postedDate, matchScore } = application;
  const { all = [], matched = [], missing = [] } = skills || {};

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(application.id, newStatus);
    }
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
              <p className="text-[#E5E5E5] text-lg">{application.company}</p>
              
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
                    <p className="text-sm font-semibold text-gray-600 mb-2">Missing Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {missing.length > 0 ? (
                        missing.map((skill, i) => (
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
                <h3 className="text-lg font-bold text-[#000000] mb-3">Description</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {description}
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. Other Tabs (Mock UI) */}
          
          {/* Timeline & Prep */}
          {activeTab === 'timeline-prep' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
              <h3 className="text-lg font-bold text-[#000000] mb-6">Application Timeline</h3>
              
              <div className="relative pl-6 border-l-2 border-[#14213D] space-y-8 mb-10 ml-4">
                <div className="relative">
                  <div className="absolute -left-[31px] bg-white p-1 rounded-full"><Clock className="w-4 h-4 text-[#14213D]" /></div>
                  <p className="font-bold text-[#14213D]">Applied</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] bg-[#14213D] p-1 rounded-full"><Clock className="w-4 h-4 text-white" /></div>
                  <p className="font-bold text-[#14213D]">Saved to Mirae</p>
                  <p className="text-sm text-gray-500">{application.appliedDate}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#000000] mb-4">Interview Prep</h3>
              <button className="w-full py-4 border-2 border-dashed border-[#FCA311] rounded-lg text-[#FCA311] font-bold hover:bg-[#FCA311]/10 transition-colors flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Generate AI Questions
              </button>
            </motion.div>
          )}

          {/* Notes */}
          {activeTab === 'notes' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
              <h3 className="text-lg font-bold text-[#000000] mb-4">Interview Notes</h3>
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
              <h3 className="text-lg font-bold text-[#000000] mb-4">Attached Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#14213D] hover:bg-gray-50 transition-colors h-40">
                  <FileText className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="font-bold text-[#14213D]">Upload Resume</p>
                  <p className="text-xs text-gray-500 mt-1">Specific to this job</p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#14213D] hover:bg-gray-50 transition-colors h-40">
                  <File className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="font-bold text-[#14213D]">Upload Cover Letter</p>
                  <p className="text-xs text-gray-500 mt-1">PDF or Word</p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </>
  );
}
