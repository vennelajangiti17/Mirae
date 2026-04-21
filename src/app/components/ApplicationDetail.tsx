import { X, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

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

interface Props {
  application: Application;
  onClose: () => void;
}

export function ApplicationDetail({ application, onClose }: Props) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = ['Overview', 'Timeline & Prep', 'Notes', 'Documents'];

  const matchedSkills = ['Node.js', 'PostgreSQL', 'React', 'TypeScript', 'GraphQL'];
  const missingSkills = ['Docker', 'AWS', 'Kubernetes'];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-60 z-40"
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
              <p className="text-[#E5E5E5]">{application.company}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-[#FCA311] text-[#000000] rounded-md font-semibold flex items-center gap-2 hover:bg-[#fdb748] transition-all">
                {application.stage}
                <ChevronDown className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="text-white hover:text-[#FCA311] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[rgba(252,163,17,0.2)]">
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
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Match Score */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#E5E5E5"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#FCA311"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - application.matchScore / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-[#FCA311]" style={{ fontFamily: 'var(--font-display)' }}>
                      {application.matchScore}%
                    </span>
                    <span className="text-sm text-[#14213D]">Match Score</span>
                  </div>
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#000000] mb-4">Matched Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 bg-[#14213D] text-white rounded-md text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-[#000000] mb-4">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 bg-[#E5E5E5] text-[#000000] rounded-md text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-4">Job Description</h3>
                <div className="bg-[#E5E5E5] bg-opacity-30 rounded-md p-4 text-[#000000] leading-relaxed text-sm">
                  <p className="mb-4">
                    We're looking for an experienced engineer to join our team. You'll be working on building
                    scalable web applications using modern technologies like{' '}
                    <span className="bg-[#FCA311] bg-opacity-30 px-1 rounded">React</span>,{' '}
                    <span className="bg-[#FCA311] bg-opacity-30 px-1 rounded">Node.js</span>, and{' '}
                    <span className="bg-[#FCA311] bg-opacity-30 px-1 rounded">PostgreSQL</span>.
                  </p>
                  <p className="mb-4">
                    You should have strong experience with <span className="bg-[#FCA311] bg-opacity-30 px-1 rounded">TypeScript</span> and
                    modern API development using <span className="bg-[#FCA311] bg-opacity-30 px-1 rounded">GraphQL</span>.
                  </p>
                  <p>
                    Familiarity with containerization technologies like Docker and cloud platforms like AWS would be a plus.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'overview' && (
            <div className="flex items-center justify-center h-64 text-[#14213D] opacity-60">
              <p>Content for {tabs.find(t => t.toLowerCase().replace(/ & /g, '-') === activeTab)} coming soon...</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
