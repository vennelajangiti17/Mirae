import { motion } from 'motion/react';
import { PieChart, Pie, Cell } from 'recharts';
import { MoreVertical } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  getAnalyticsOverview,
  getStatusBreakdown,
  getTrends,
} from '../services/analyticsService';

type OverviewData = {
  totalJobs: number;
  saved: number;
  applied: number;
  interviewing: number;
  offers: number;
  rejected: number;
  avgMatchScore: number;
  topSkills: { skill: string; count: number }[];
};

type StatusItem = {
  status: string;
  count: number;
};

type TrendItem = {
  date: string;
  count: number;
};

export function Analytics() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusItem[]>([]);
  const [trends, setTrends] = useState<TrendItem[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [overviewData, statusData, trendsData] = await Promise.all([
          getAnalyticsOverview(),
          getStatusBreakdown(),
          getTrends(),
        ]);

        setOverview(overviewData);
        setStatusBreakdown(statusData || []);
        setTrends(trendsData || []);
      } catch (error) {
        console.error('Analytics fetch error:', error);
      }
    };

    loadAnalytics();
  }, []);

  const donutData = useMemo(() => {
    const offers = overview?.offers ?? 0;
    const rejected = overview?.rejected ?? 0;
    const active =
      (overview?.saved ?? 0) +
      (overview?.applied ?? 0) +
      (overview?.interviewing ?? 0);

    return [
      { name: 'Offers', value: offers, color: '#067647' },
      { name: 'Rejected', value: rejected, color: '#B42318' },
      { name: 'Active', value: active, color: '#14213D' },
    ];
  }, [overview]);

  const skillBars = useMemo(() => {
    const topSkills = overview?.topSkills || [];
    const max = topSkills.length
      ? Math.max(...topSkills.map((item) => item.count))
      : 1;

    return topSkills.map((item) => ({
      skill: item.skill,
      count: item.count,
      max,
    }));
  }, [overview]);

  const funnelSteps = useMemo(() => {
    const total = overview?.totalJobs ?? 0;
    const calcPercent = (value: number) =>
      total > 0 ? Math.round((value / total) * 100) : 0;

    return [
      {
        label: 'Saved',
        value: overview?.saved ?? 0,
        percent: calcPercent(overview?.saved ?? 0),
        color: '#6b7280',
      },
      {
        label: 'Applied',
        value: overview?.applied ?? 0,
        percent: calcPercent(overview?.applied ?? 0),
        color: '#14213D',
      },
      {
        label: 'Interviewing',
        value: overview?.interviewing ?? 0,
        percent: calcPercent(overview?.interviewing ?? 0),
        color: '#3b82f6',
      },
      {
        label: 'Offer',
        value: overview?.offers ?? 0,
        percent: calcPercent(overview?.offers ?? 0),
        color: '#067647',
      },
      {
        label: 'Rejected',
        value: overview?.rejected ?? 0,
        percent: calcPercent(overview?.rejected ?? 0),
        color: '#B42318',
      },
    ];
  }, [overview]);

  return (
    <div className="ml-60 min-h-screen bg-[#E5E5E5] pb-6">
      <div className="bg-white border-b border-[#E5E5E5] px-8 py-5 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-[#000000]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Analytics & Insights
          </h1>
          <button className="p-2 hover:bg-[#E5E5E5] rounded transition-colors">
            <MoreVertical className="w-5 h-5 text-[#14213D]" />
          </button>
        </div>
      </div>

      <div className="px-8 pt-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white rounded-lg p-5 border border-[#E5E5E5] shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-[#14213D] mb-2 font-semibold opacity-60">
              SAVED
            </div>
            <div className="text-4xl font-bold text-[#000000] mb-3 leading-none">
              {overview?.saved ?? 0}
            </div>
            <div className="inline-flex items-center px-3 py-1.5 bg-[#DBEAFE] rounded-full">
              <span className="text-xs font-semibold text-[#1E40AF]">
                Avg match {overview?.avgMatchScore ?? 0}%
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg p-5 border border-[#E5E5E5] shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-[#14213D] mb-2 font-semibold opacity-60">
              APPLIED
            </div>
            <div className="text-4xl font-bold text-[#000000] mb-3 leading-none">
              {overview?.applied ?? 0}
            </div>
            <div className="inline-flex items-center px-3 py-1.5 bg-[#FEF3C7] rounded-full">
              <span className="text-xs font-semibold text-[#92400E]">
                {overview?.interviewing ?? 0} interviewing
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-white rounded-lg p-5 border border-[#E5E5E5] shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-[#14213D] mb-2 font-semibold opacity-60">
              REJECTED
            </div>
            <div className="text-4xl font-bold text-[#000000] mb-3 leading-none">
              {overview?.rejected ?? 0}
            </div>
            <div className="inline-flex items-center px-3 py-1.5 bg-[#FDE2E2] rounded-full">
              <span className="text-xs font-semibold text-[#B42318]">
                {overview?.totalJobs ?? 0} total jobs
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg p-5 border border-[#E5E5E5] shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-[#14213D] mb-2 font-semibold opacity-60">
              OFFERS
            </div>
            <div className="text-4xl font-bold text-[#000000] mb-3 leading-none">
              {overview?.offers ?? 0}
            </div>
            <div className="inline-flex items-center px-3 py-1.5 bg-[#DDF7EA] rounded-full">
              <span className="text-xs font-semibold text-[#067647]">
                {trends.length} tracked days
              </span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-white rounded-lg p-6 border border-[#E5E5E5] shadow-sm"
            >
              <h3 className="text-lg font-bold text-[#000000] mb-5">
                Application Funnel
              </h3>

              <div className="space-y-4">
                {funnelSteps.map((step, index) => (
                  <div key={step.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#14213D]">
                        {step.label}
                      </span>
                      <span className="text-sm font-bold text-[#000000]">
                        {step.value}{' '}
                        <span className="text-[#6b7280] font-normal">
                          ({step.percent}%)
                        </span>
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-lg p-6 border border-[#E5E5E5] shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-[#000000]">
                  Status Breakdown
                </h3>
                <span className="text-sm text-[#6b7280] font-medium">
                  {overview?.totalJobs ?? 0} total
                </span>
              </div>

              <div className="space-y-4">
                {statusBreakdown.length === 0 ? (
                  <p className="text-sm text-[#6b7280]">No status data yet.</p>
                ) : (
                  statusBreakdown.map((item, index) => (
                    <motion.div
                      key={item.status}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                      className="border-b border-[#E5E5E5] pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-bold text-base text-[#000000]">
                          {item.status}
                        </div>
                        <span className="px-3 py-1 bg-[#E5E5E5] text-[#14213D] rounded-full text-xs font-semibold ml-3 flex-shrink-0">
                          {item.count}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-white rounded-lg p-6 border border-[#E5E5E5] shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#000000]">
                  Final Outcomes
                </h3>
                <span className="text-sm text-[#6b7280] font-medium">
                  {overview?.totalJobs ?? 0} jobs
                </span>
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
                      <Cell
                        key={`donut-cell-${entry.name}-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                </PieChart>

                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-3xl font-bold text-[#000000]">
                    {overview?.totalJobs ?? 0}
                  </div>
                  <div className="text-xs text-[#6b7280]">jobs</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6">
                {donutData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="text-sm">
                      <span className="font-semibold text-[#000000]">
                        {item.name}
                      </span>
                      <span className="text-[#6b7280] ml-1">
                        ({item.value})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-lg p-6 border border-[#E5E5E5] shadow-sm"
            >
              <h3 className="text-lg font-bold text-[#000000] mb-4">
                Top Skills
              </h3>

              <div className="space-y-3">
                {skillBars.length === 0 ? (
                  <p className="text-sm text-[#6b7280]">No skill data yet.</p>
                ) : (
                  skillBars.map((skill, index) => {
                    const widthPercent =
                      skill.max > 0 ? (skill.count / skill.max) * 100 : 0;

                    return (
                      <div key={skill.skill}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#14213D]">
                            {skill.skill}
                          </span>
                          <span className="text-sm font-bold text-[#000000]">
                            {skill.count}
                          </span>
                        </div>

                        <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPercent}%` }}
                            transition={{
                              duration: 0.6,
                              delay: 0.35 + index * 0.05,
                            }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor:
                                index === 1 ? '#FCA311' : '#14213D',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
