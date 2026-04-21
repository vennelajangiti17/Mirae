import { ChevronLeft, ChevronRight, ChevronDown, Mail, ExternalLink, FileText, Check, X, Edit2, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface CalendarEvent {
  id: string;
  date: number;
  type: 'deadline' | 'interview' | 'followup';
  title: string;
  startTime: string;
  endTime: string;
  duration: string;
}

interface AgendaTask {
  id: number;
  date: string;
  dateLabel: string;
  task: string;
  action: string;
  type: 'deadline' | 'interview' | 'followup';
  status?: 'completed' | 'missed' | 'active';
  isPast?: boolean;
}

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(3); // April = 3 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const today = 21;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2;
    return day > 0 && day <= 30 ? day : null;
  });

  const events: CalendarEvent[] = [
    { id: '1', date: 15, type: 'deadline', title: 'Submit application - Meta', startTime: '09:00 AM', endTime: '05:00 PM', duration: '8h' },
    { id: '2', date: 15, type: 'interview', title: 'Phone screen - Vercel', startTime: '02:00 PM', endTime: '03:00 PM', duration: '1h' },
    { id: '3', date: 15, type: 'followup', title: 'Follow up - TechCo', startTime: '04:00 PM', endTime: '04:30 PM', duration: '30m' },
    { id: '4', date: 18, type: 'interview', title: 'Technical Interview - Stripe', startTime: '10:00 AM', endTime: '11:30 AM', duration: '1h 30m' },
    { id: '5', date: 22, type: 'followup', title: 'Follow-up: Google STEP', startTime: '03:00 PM', endTime: '03:30 PM', duration: '30m' },
    { id: '6', date: 22, type: 'followup', title: 'Check status - Linear', startTime: '05:00 PM', endTime: '05:15 PM', duration: '15m' },
    { id: '7', date: 25, type: 'interview', title: 'Final Interview - Meta', startTime: '10:00 AM', endTime: '12:00 PM', duration: '2h' },
    { id: '8', date: 25, type: 'deadline', title: 'Coding challenge due - Stripe', startTime: '11:59 PM', endTime: '11:59 PM', duration: '-' },
    { id: '9', date: 28, type: 'interview', title: 'Technical Round - Meta', startTime: '02:00 PM', endTime: '04:00 PM', duration: '2h' },
  ];

  const upcomingTasks: AgendaTask[] = [
    { id: 1, date: 'Apr 14, 2026', dateLabel: '7 days ago', task: 'Submit application - Meta', action: 'View Details', type: 'deadline', status: 'completed', isPast: true },
    { id: 2, date: 'Apr 18, 2026', dateLabel: '3 days ago', task: 'Technical Interview - Stripe', action: 'View Prep Notes', type: 'interview', status: 'missed', isPast: true },
    { id: 3, date: 'Tomorrow (Apr 22, 2026)', dateLabel: 'Tomorrow', task: 'Submit coding challenge', action: 'Open Link', type: 'deadline', status: 'active' },
    { id: 4, date: 'in 3 days (Apr 24, 2026)', dateLabel: 'In 3 days', task: 'Follow up with Acme Corp', action: 'Draft Email', type: 'followup', status: 'active' },
    { id: 5, date: 'in 7 days (Apr 28, 2026)', dateLabel: 'In 7 days', task: 'Technical Interview - Meta', action: 'View Prep Notes', type: 'interview', status: 'active' },
  ];

  const getEventsForDate = (day: number) => events.filter(e => e.date === day);

  // Check for actual time overlaps (not just multiple events on same day)
  const hasClash = (day: number) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length < 2) return false;

    // Convert time to minutes for comparison
    const timeToMinutes = (time: string) => {
      const [timeStr, period] = time.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    // Check if any two events overlap
    for (let i = 0; i < dayEvents.length; i++) {
      for (let j = i + 1; j < dayEvents.length; j++) {
        const event1Start = timeToMinutes(dayEvents[i].startTime);
        const event1End = timeToMinutes(dayEvents[i].endTime);
        const event2Start = timeToMinutes(dayEvents[j].startTime);
        const event2End = timeToMinutes(dayEvents[j].endTime);

        // Check if events overlap
        if (event1Start < event2End && event2Start < event1End) {
          return true;
        }
      }
    }
    return false;
  };

  const getEventColor = (type: 'deadline' | 'interview' | 'followup') => {
    switch (type) {
      case 'deadline': return { bg: '#FDE2E2', text: '#B42318' };
      case 'interview': return { bg: '#DDF7EA', text: '#067647' };
      case 'followup': return { bg: '#DBEAFE', text: '#1E40AF' };
    }
  };

  const getEventIcon = (type: 'deadline' | 'interview' | 'followup') => {
    switch (type) {
      case 'deadline': return '⚠️';
      case 'interview': return '💼';
      case 'followup': return '📧';
    }
  };

  const goToToday = () => {
    setCurrentMonth(3); // April
    setCurrentYear(2026);
  };

  // Calculate weekly stats
  const thisWeekDays = [15, 16, 17, 18, 19, 20, 21]; // Example week containing today
  const weekEvents = events.filter(e => thisWeekDays.includes(e.date));
  const weekStats = {
    total: weekEvents.length,
    interviews: weekEvents.filter(e => e.type === 'interview').length,
    deadlines: weekEvents.filter(e => e.type === 'deadline').length,
    followups: weekEvents.filter(e => e.type === 'followup').length,
  };

  return (
    <div className="ml-60 min-h-screen bg-[#E5E5E5] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold text-[#000000] mb-8" style={{ fontFamily: 'var(--font-display)' }}>
          Calendar & Reminders
        </h1>

        <div className="grid grid-cols-[1fr_400px] gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-[#E5E5E5]"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="relative">
                <button
                  onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#E5E5E5] rounded-lg transition-colors"
                >
                  <h2 className="text-2xl font-bold text-[#14213D]" style={{ fontFamily: 'var(--font-display)' }}>
                    {monthNames[currentMonth]}
                  </h2>
                  <ChevronDown className="w-5 h-5 text-[#14213D]" />
                </button>

                {/* Month/Year Picker Dropdown */}
                <AnimatePresence>
                  {showMonthYearPicker && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setShowMonthYearPicker(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-[#E5E5E5] p-4 z-30 w-80"
                      >
                        <div>
                          <label className="text-xs font-semibold text-[#14213D] mb-3 block">Select Month</label>
                          <div className="grid grid-cols-3 gap-2">
                            {monthNames.map((month, idx) => (
                              <button
                                key={month}
                                onClick={() => {
                                  setCurrentMonth(idx);
                                  setShowMonthYearPicker(false);
                                }}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  currentMonth === idx
                                    ? 'bg-[#FCA311] text-[#000000]'
                                    : 'bg-[#E5E5E5] text-[#14213D] hover:bg-[#FCA311] hover:bg-opacity-20'
                                }`}
                              >
                                {month.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(m => (m === 0 ? 11 : m - 1))}
                  className="p-2 hover:bg-[#E5E5E5] rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[#14213D]" />
                </button>
                <button
                  onClick={() => setCurrentMonth(m => (m === 11 ? 0 : m + 1))}
                  className="p-2 hover:bg-[#E5E5E5] rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[#14213D]" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-[#14213D] pb-3">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDate(day || 0);
                const isToday = day === today;
                const isClash = day ? hasClash(day) && day === 25 : false;
                const isSelected = day === selectedDate;

                return (
                  <div
                    key={index}
                    onClick={() => day && setSelectedDate(day)}
                    className={`
                      aspect-square border rounded-xl p-3 relative transition-all
                      ${!day ? 'bg-transparent border-transparent' : ''}
                      ${day && !isToday && !isClash && !isSelected ? 'bg-white border-[#E5E5E5] hover:border-[#FCA311] hover:shadow-sm cursor-pointer' : ''}
                      ${isToday ? 'bg-[#E0F2FE] border-[#378ADD] border-2 shadow-md relative' : ''}
                      ${isClash && !isToday ? 'bg-[#FEF3C7] bg-opacity-30 border-[#FCA311] border-2 border-dashed' : ''}
                      ${isSelected && !isToday ? 'bg-white border-[#14213D] border-2 shadow-lg' : ''}
                      ${day ? 'cursor-pointer' : ''}
                    `}
                  >
                    {day && (
                      <>
                        {isToday && (
                          <div className="absolute top-2 left-2 w-7 h-7 bg-[#378ADD] rounded-full -z-0"></div>
                        )}
                        <span className={`relative z-10 text-sm font-semibold ${
                          isToday ? 'text-white' : 'text-[#14213D]'
                        }`}>
                          {day}
                        </span>

                        {/* Event Dots */}
                        {dayEvents.length > 0 && (
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                            {dayEvents.slice(0, 3).map((event, i) => {
                              const colors = getEventColor(event.type);
                              return (
                                <div
                                  key={i}
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: colors.text }}
                                ></div>
                              );
                            })}
                            {dayEvents.length > 3 && (
                              <span className="text-[8px] text-[#6b7280] font-medium">+{dayEvents.length - 3}</span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Google Calendar Sync & Legend */}
            <div className="mt-6 pt-6 border-t border-[#E5E5E5] space-y-4">
              {/* Google Calendar Connection */}
              <div className="flex items-center justify-between p-3 bg-[#E0F2FE] bg-opacity-50 rounded-lg border border-[#378ADD] border-opacity-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-[#378ADD]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#14213D]">Google Calendar Connected</div>
                    <div className="text-xs text-[#6b7280]">Syncing events & reminders</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#067647] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#067647] font-medium">Active</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#378ADD] rounded-full"></div>
                  <span className="text-sm text-[#14213D]">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#FCA311] border-dashed rounded"></div>
                  <span className="text-sm text-[#14213D]">Time Clash</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#B42318] rounded-full"></div>
                  <span className="text-xs text-[#14213D]">Deadline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#067647] rounded-full"></div>
                  <span className="text-xs text-[#14213D]">Interview</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1E40AF] rounded-full"></div>
                  <span className="text-xs text-[#14213D]">Follow-up</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Date Details Panel */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0B132B] bg-opacity-30 p-8"
                style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                onClick={() => setSelectedDate(null)}
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-xl p-6 shadow-2xl border border-[#E5E5E5] max-w-md w-full max-h-[80vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-bold text-[#14213D]" style={{ fontFamily: 'var(--font-display)' }}>
                        {monthNames[currentMonth]} {selectedDate}, {currentYear}
                      </h3>
                      <p className="text-sm text-[#6b7280] mt-1">
                        {getEventsForDate(selectedDate).length === 0
                          ? 'No events scheduled'
                          : `${getEventsForDate(selectedDate).length} event${getEventsForDate(selectedDate).length !== 1 ? 's' : ''}`
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="p-2 hover:bg-[#E5E5E5] rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-[#14213D]" />
                    </button>
                  </div>

                  {getEventsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#E5E5E5] rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon className="w-8 h-8 text-[#14213D] opacity-40" />
                      </div>
                      <p className="text-[#6b7280] mb-4">No reminders for this day</p>
                      <button className="px-4 py-2 bg-[#FCA311] text-[#000000] rounded-lg font-semibold hover:bg-[#fdb748] transition-all text-sm">
                        + Add Event
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getEventsForDate(selectedDate).map((event) => {
                      const colors = getEventColor(event.type);
                      return (
                        <div
                          key={event.id}
                          className="border border-[#E5E5E5] rounded-lg p-4 hover:border-[#FCA311] transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="font-bold text-base text-[#14213D] mb-1">{event.title}</div>
                              <div className="text-sm text-[#6b7280]">
                                {event.startTime} - {event.endTime} <span className="text-xs">({event.duration})</span>
                              </div>
                            </div>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold ml-3 flex-shrink-0"
                              style={{ backgroundColor: colors.bg, color: colors.text }}
                            >
                              {event.type === 'interview' ? 'Interview' : event.type === 'deadline' ? 'Deadline' : 'Follow-up'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-[#E5E5E5] rounded-lg transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4 text-[#14213D]" />
                            </button>
                            <button className="p-2 hover:bg-[#FDE2E2] rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4 text-[#B42318]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Weekly Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]"
            >
              <h2 className="text-lg font-bold text-[#14213D] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                Weekly Summary
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[#E5E5E5]">
                  <span className="text-sm text-[#14213D]">Total Events</span>
                  <span className="text-xl font-bold text-[#FCA311]">{weekStats.total}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E5E5E5]">
                  <span className="text-sm text-[#14213D]">Interviews</span>
                  <span className="text-lg font-bold text-[#067647]">{weekStats.interviews}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E5E5E5]">
                  <span className="text-sm text-[#14213D]">Deadlines</span>
                  <span className="text-lg font-bold text-[#B42318]">{weekStats.deadlines}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#14213D]">Follow-ups</span>
                  <span className="text-lg font-bold text-[#1E40AF]">{weekStats.followups}</span>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Agenda */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]"
            >
              <h2 className="text-lg font-bold text-[#14213D] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                Upcoming Agenda
              </h2>

              <div className="space-y-3">
                {upcomingTasks.map((task, index) => {
                  const isActive = task.status === 'active';
                  const isCompleted = task.status === 'completed';
                  const isMissed = task.status === 'missed';
                  const colors = getEventColor(task.type);

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      className={`border rounded-xl p-4 transition-all ${
                        task.isPast
                          ? 'border-[#E5E5E5] bg-[#f9fafb] opacity-60'
                          : 'border-[#E5E5E5] bg-white hover:border-[#FCA311] hover:shadow-sm cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-xs font-bold" style={{ color: task.isPast ? '#9ca3af' : '#FCA311' }}>
                              {task.dateLabel}
                            </div>
                            {isCompleted && (
                              <div className="flex items-center gap-1 text-[10px] text-[#067647] bg-[#DDF7EA] px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" />
                                <span>Completed</span>
                              </div>
                            )}
                            {isMissed && (
                              <div className="flex items-center gap-1 text-[10px] text-[#B42318] bg-[#FDE2E2] px-2 py-0.5 rounded-full">
                                <X className="w-3 h-3" />
                                <span>Missed</span>
                              </div>
                            )}
                          </div>
                          <div className={`text-sm font-semibold ${task.isPast ? 'text-[#9ca3af]' : 'text-[#14213D]'}`}>
                            {task.task}
                          </div>
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-semibold ml-3 flex-shrink-0"
                          style={{
                            backgroundColor: task.isPast ? '#f3f4f6' : colors.bg,
                            color: task.isPast ? '#9ca3af' : colors.text
                          }}
                        >
                          {getEventIcon(task.type)} {task.type === 'interview' ? 'Interview' : task.type === 'deadline' ? 'Deadline' : 'Follow-up'}
                        </span>
                      </div>
                      <button
                        className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          task.isPast
                            ? 'bg-[#E5E5E5] text-[#9ca3af] cursor-not-allowed'
                            : 'bg-[#FCA311] text-[#000000] hover:bg-[#fdb748] shadow-sm hover:shadow-md'
                        }`}
                        disabled={task.isPast}
                      >
                        {task.action === 'Draft Email' ? <Mail className="w-4 h-4" /> :
                         task.action === 'Open Link' ? <ExternalLink className="w-4 h-4" /> :
                         <FileText className="w-4 h-4" />}
                        {task.action}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
