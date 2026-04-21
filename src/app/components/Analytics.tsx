import { motion } from 'motion/react';
import { PieChart, Pie, Cell } from 'recharts';
import { MoreVertical } from 'lucide-react';

export function Analytics() {
  const donutData = [
    { name: 'Offers', value: 2, color: '#067647' },
    { name: 'Rejected', value: 18, color: '#B42318' },
    { name: 'Active', value: 22, color: '#14213D' },
  ];

  const skillBars = [
    { skill: 'React', count: 28, max: 28 },
    { skill: 'SQL', count: 22, max: 28 },
    { skill: 'Node.js', count: 19, max: 28 },
  ];

  const rejectedCompanies = [
    { company: 'TechFlow', role: 'Backend Engineer', reason: 'Ghosted after OA' },
    { company: 'StartupX', role: 'Product Engineer', reason: 'No skills match' },
    { company: 'MetaCo', role: 'Software Engineer', reason: 'Failed technical round' },
    { company: 'DataInc', role: 'ML Engineer', reason: 'Position filled internally' },
  ];

  const funnelSteps = [
    { label: 'Applied', value: 42, percent: 100, color: '#14213D' },
    { label: 'Got response', value: 12, percent: 29, color: '#FCA311' },
    { label: 'Interview stage', value: 8, percent: 19, color: '#3b82f6' },
    { label: 'Rejected directly', value: 4, percent: 10, color: '#B42318' },
    { label: 'Offer received', value: 2, percent: 5, color: '#067647' },
    { label: 'Rejected after interview', value: 6, percent: 14, color: '#B42318' },
  ];

  return (
    <div className="ml-60 min-h-screen bg-[#E5E5E5] pb-6">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E5E5E5] px-8 py-5 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#000000]" style={{ fontFamily: 'var(--font-display)' }}>
            Analytics & Insights
          </h1>
          <button className="p-2 hover:bg-[#E5E5E5] rounded transition-colors">
            <MoreVertical className="w-5 h-5 text-[#14213D]" />
          </button>
        </div>
      </div>

      <div className="px-8 pt-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white rounded-lg p-5 border border-[#E5E5E5] shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-[#14213D] mb-2 font-semibold opacity-60">SAVED</div>
            <div className="text-4xl font-bold text-[#000000] mb-3 leading-none">64</div>
            <div className="inline-flex items-center px-3 py-1.5 bg-[#DBEAFE] rounded-full">
              <span className="text-xs font-semibold text-[#1E40AF]">42 applied (66%)</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg p-5 border border-[#E5E5E5] shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-[#14213D] mb-2 font-semibold opacity-60">APPLIED</div>
            <div className="text-4xl font-bold text-[#000000] mb-3 leading-none">42</div>
            <div className="inline-flex items-center px-3 py-1.5 bg-[#FEF3C7] rounded-full">
              <span className="text-xs font-semibold text-[#92400E]">12 responded (29%)</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-white rounded-lg p-5 border border-[#E5E5E5] shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-[#14213D] mb-2 font-semibold opacity-60">REJECTED</div>
            <div className="text-4xl font-bold text-[#000000] mb-3 leading-none">18</div>
            <div className="inline-flex items-center px-3 py-1.5 bg-[#FDE2E2] rounded-full">
              <span className="text-xs font-semibold text-[#B42318]">43% of applied</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg p-5 border border-[#E5E5E5] shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-[#14213D] mb-2 font-semibold opacity-60">OFFERS</div>
            <div className="text-4xl font-bold text-[#000000] mb-3 leading-none">2</div>
            <div className="inline-flex items-center px-3 py-1.5 bg-[#DDF7EA] rounded-full">
              <span className="text-xs font-semibold text-[#067647]">5% success rate</span>
            </div>
          </motion.div>
        </div>

        {/* Detailed Insight Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Application Funnel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-white rounded-lg p-6 border border-[#E5E5E5] shadow-sm"
            >
              <h3 className="text-lg font-bold text-[#000000] mb-5">Application Funnel</h3>

              <div className="space-y-4">
                {funnelSteps.map((step, index) => (
                  <div key={step.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#14213D]">{step.label}</span>
                      <span className="text-sm font-bold text-[#000000]">
                        {step.value} <span className="text-[#6b7280] font-normal">({step.percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${step.percent}%` }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: step.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Rejection Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-lg p-6 border border-[#E5E5E5] shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-[#000000]">Rejection Breakdown</h3>
                <span className="text-sm text-[#6b7280] font-medium">18 total</span>
              </div>

              <div className="space-y-4">
                {rejectedCompanies.map((item, index) => (
                  <motion.div
                    key={item.company}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                    className="border-b border-[#E5E5E5] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base text-[#000000] truncate">{item.company}</div>
                        <div className="text-sm text-[#14213D] opacity-70">{item.role}</div>
                      </div>
                      <span className="px-3 py-1 bg-[#FDE2E2] text-[#B42318] rounded-full text-xs font-semibold ml-3 flex-shrink-0">
                        Rejected
                      </span>
                    </div>
                    <p className="text-sm text-[#6b7280]">{item.reason}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Final Outcomes - Donut Chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-white rounded-lg p-6 border border-[#E5E5E5] shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#000000]">Final Outcomes</h3>
                <span className="text-sm text-[#6b7280] font-medium">42 apps</span>
              </div>

              <div className="flex items-center justify-center mb-6 relative">
                <PieChart width={240} height={240}>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`donut-cell-${entry.name}-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-3xl font-bold text-[#000000]">42</div>
                  <div className="text-xs text-[#6b7280]">applications</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6">
                {donutData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                    <div className="text-sm">
                      <span className="font-semibold text-[#000000]">{item.name}</span>
                      <span className="text-[#6b7280] ml-1">({item.value})</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Offer Details & Demanded Skills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-lg p-6 border border-[#E5E5E5] shadow-sm"
            >
              <h3 className="text-lg font-bold text-[#000000] mb-4">Offer Details</h3>

              {/* Offer Details */}
              <div className="mb-6 pb-6 border-b border-[#E5E5E5]">
                <p className="text-sm text-[#14213D] font-semibold mb-4 opacity-70">2 active offers</p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base text-[#000000]">Stripe</div>
                      <div className="text-sm text-[#14213D] opacity-70">Senior Frontend Engineer</div>
                    </div>
                    <span className="px-3 py-1 bg-[#DDF7EA] text-[#067647] rounded-full text-xs font-semibold ml-3 flex-shrink-0">
                      Offer
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base text-[#000000]">Vercel</div>
                      <div className="text-sm text-[#14213D] opacity-70">Full Stack Developer</div>
                    </div>
                    <span className="px-3 py-1 bg-[#DDF7EA] text-[#067647] rounded-full text-xs font-semibold ml-3 flex-shrink-0">
                      Offer
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#6b7280]">
                  Interview → Offer rate: 25% • Avg. time: 3 weeks
                </p>
              </div>

              {/* Most Demanded Skills */}
              <div>
                <h4 className="text-base font-bold text-[#000000] mb-4">Most Demanded Skills</h4>
                <div className="space-y-3">
                  {skillBars.map((skill, index) => {
                    const widthPercent = (skill.count / skill.max) * 100;
                    return (
                      <div key={skill.skill}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#14213D]">{skill.skill}</span>
                          <span className="text-sm font-bold text-[#000000]">{skill.count}</span>
                        </div>
                        <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPercent}%` }}
                            transition={{ duration: 0.6, delay: 0.35 + index * 0.05 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: index === 1 ? '#FCA311' : '#14213D' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
