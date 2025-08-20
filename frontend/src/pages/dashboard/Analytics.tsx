import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../lib/api';

type SeriesPoint = { date: string; count: number };

export const Analytics: React.FC = () => {
  const { user } = useAuth();
  const roleColor = useMemo(() => (user?.role === 'organizer' ? 'blue' : 'green') as const, [user?.role]);
  const [registrationTrend, setRegistrationTrend] = useState<SeriesPoint[]>([]);
  const [submissionTrend, setSubmissionTrend] = useState<SeriesPoint[]>([]);
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    // populate event list for organizers
    (async () => {
      if (user?.role !== 'organizer') return;
      const pairs: Array<{ id: string; title: string }> = [];
      try {
        const resp = await apiFetch<any[]>(`/api/events`);
        const list = Array.isArray(resp) ? resp : (resp as any)?.data || [];
        pairs.push(...(list || []).map((e: any) => ({ id: e.id, title: e.name || e.title || 'Event' })));
      } catch {}
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i) as string;
          if (key && key.startsWith('hv_events_')) {
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            pairs.push(...list.map((e: any) => ({ id: e.id, title: e.title })));
          }
        }
      } catch {}
      const map = new Map(pairs.map(p => [p.id, p]));
      setEvents(Array.from(map.values()));
    })();
  }, [user?.role, user?.id]);

  useEffect(() => {
    (async () => {
      const days = 14;
      const today = new Date();
      const zeroSeries = Array.from({ length: days }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (days - i));
        return { date: d.toISOString().slice(0, 10), count: 0 } as SeriesPoint;
      });

      const byDate = (list: Array<{ createdAt: string }>) => {
        const counts: Record<string, number> = {};
        for (const item of list) {
          const key = new Date(item.createdAt).toISOString().slice(0, 10);
          counts[key] = (counts[key] || 0) + 1;
        }
        return zeroSeries.map(p => ({ ...p, count: counts[p.date] || 0 }));
      };

      // Registrations per event
      try {
        const regs = eventId
          ? await apiFetch<any[]>(`/api/registrations?forEvent=1&eventId=${encodeURIComponent(eventId)}`)
          : [];
        const filtered = (regs || []).filter((r: any) => !eventId || (r.event?.id || r.eventId) === eventId);
        setRegistrationTrend(byDate(filtered.map((r: any) => ({ createdAt: r.createdAt }))));
      } catch {
        // local fallback
        const local: Array<{ createdAt: string; eventId: string }> = [];
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i) as string;
            if (key && key.startsWith('hv_reg_')) {
              const parts = key.split('_');
              const eid = parts[parts.length - 1];
              if (!eventId || eid === eventId) {
                local.push({ createdAt: new Date().toISOString(), eventId: eid });
              }
            }
          }
        } catch {}
        setRegistrationTrend(byDate(local));
      }

      // Submissions per event
      try {
        const subs = eventId
          ? await apiFetch<any[]>(`/api/submissions?eventId=${encodeURIComponent(eventId)}`)
          : [];
        const filtered = (subs || []).filter((s: any) => !eventId || (s.event?.id || s.eventId) === eventId);
        setSubmissionTrend(byDate(filtered.map((s: any) => ({ createdAt: s.createdAt }))));
      } catch {
        // local fallback
        const localSubs: Array<{ createdAt: string }> = JSON.parse(localStorage.getItem(`hv_submissions_${eventId}`) || '[]');
        setSubmissionTrend(byDate(localSubs));
      }
    })();
  }, [eventId, user?.id]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-orbitron font-bold">Analytics</h1>
      {user?.role === 'organizer' && (
        <Card roleColor={roleColor}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event</label>
              <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="neon-input w-full px-4 py-2.5 text-white rounded-lg">
                <option value="">All Events</option>
                {events.map(e => (<option key={e.id} value={e.id}>{e.title}</option>))}
              </select>
            </div>
          </div>
        </Card>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card roleColor={roleColor}>
          <h2 className="text-white font-semibold mb-3">Registrations (last 14 days)</h2>
          <div className="flex gap-2 items-end h-40">
            {registrationTrend.map((p, i) => (
              <div key={i} className="bg-neon-blue/40 w-3" style={{ height: `${(p.count/Math.max(1, Math.max(...registrationTrend.map(x=>x.count))))*100}%` }} title={`${p.date}: ${p.count}`} />
            ))}
          </div>
        </Card>
        <Card roleColor={roleColor}>
          <h2 className="text-white font-semibold mb-3">Submissions (last 14 days)</h2>
          <div className="flex gap-2 items-end h-40">
            {submissionTrend.map((p, i) => (
              <div key={i} className="bg-neon-purple/40 w-3" style={{ height: `${(p.count/Math.max(1, Math.max(...submissionTrend.map(x=>x.count))))*100}%` }} title={`${p.date}: ${p.count}`} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;


