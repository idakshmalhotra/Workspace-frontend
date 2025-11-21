import React, { useMemo } from 'react';
import './StatsGrid.css';
import { getSessions } from '../../services/sessionStore';

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.max(0, Math.round(mins - h * 60));
  return `${h}h ${m}m`;
}

const StatsGrid: React.FC = () => {
  const { todayMins, weeklyAvgFocus, weeklySessions, streak } = useMemo(() => {
    const sessions = getSessions();
    const todayIso = new Date().toISOString().split('T')[0];

    let todayMins = 0;
    let weeklyFocusSum = 0;
    let weeklyCount = 0;
    let weeklySessions = 0;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    sessions.forEach(s => {
      const start = new Date(s.startIso);
      const end = s.endIso ? new Date(s.endIso) : start;
      const mins = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
      const dateIso = s.startIso.split('T')[0];
      if (dateIso === todayIso) todayMins += mins;
      if (start >= sevenDaysAgo) {
        weeklyFocusSum += s.averageFocus || 0;
        weeklyCount += 1;
        weeklySessions += 1;
      }
    });

    // Include active session elapsed time
    try {
      const raw = localStorage.getItem('activeSession');
      if (raw) {
        const a = JSON.parse(raw);
        const start = new Date(a.startIso);
        const mins = Math.max(0, Math.round((Date.now() - start.getTime()) / 60000));
        if (a.startIso.split('T')[0] === todayIso) todayMins += mins;
      }
    } catch {}

    // Streak: number of consecutive days (including today) with at least one session
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const iso = d.toISOString().split('T')[0];
      const had = sessions.some(s => s.startIso.startsWith(iso));
      if (i === 0) {
        // include active session as well
        try {
          const raw = localStorage.getItem('activeSession');
          if (raw) {
            const a = JSON.parse(raw);
            if (a.startIso.startsWith(iso)) {
              streak += 1;
              continue;
            }
          }
        } catch {}
      }
      if (had) streak += 1; else break;
    }

    return {
      todayMins,
      weeklyAvgFocus: weeklyCount ? Math.round((weeklyFocusSum / weeklyCount) * 10) / 10 : 0,
      weeklySessions,
      streak
    };
  }, []);

  const stats = [
    { icon: '⏰', value: formatDuration(todayMins), label: "Today's Focus Time", color: 'green' },
    { icon: '📊', value: `${weeklyAvgFocus}%`, label: 'Weekly Avg Focus', color: 'blue' },
    { icon: '🗓️', value: String(weeklySessions), label: 'Sessions This Week', color: 'purple' },
    { icon: '🔥', value: String(streak), label: 'Day Streak', color: 'orange' }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
