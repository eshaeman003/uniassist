import { Check, Circle } from 'lucide-react';
import { formatDate } from '../utils/format';
import { REPORT_STATUSES } from '../data/mockData';

export default function ReportTimeline({ report }) {
  const currentIdx = REPORT_STATUSES.indexOf(report.status);

  return (
    <div className="timeline">
      {REPORT_STATUSES.map((status, idx) => {
        const entry = report.timeline.find((t) => t.status === status);
        const isDone = idx < currentIdx || (idx === currentIdx && status === 'Resolved');
        const isCurrent = idx === currentIdx && status !== 'Resolved';
        const state = isDone ? 'done' : isCurrent ? 'current' : 'upcoming';

        return (
          <div className="timeline-item" key={status}>
            <div className="timeline-marker-wrap">
              <div className={`timeline-marker ${state}`}>
                {state === 'done' ? <Check size={14} /> : <Circle size={8} fill="currentColor" />}
              </div>
              {idx < REPORT_STATUSES.length - 1 && <div className={`timeline-line ${state === 'done' ? 'done' : ''}`} />}
            </div>
            <div className="timeline-content">
              <h4 style={{ color: state === 'upcoming' ? 'var(--text-faint)' : 'var(--text)' }}>{status}</h4>
              {entry ? (
                <>
                  <div className="timeline-date">{formatDate(entry.date)}</div>
                  <p>{entry.note}</p>
                </>
              ) : (
                <div className="timeline-date">Pending</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
