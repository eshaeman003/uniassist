import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };

export default function Toast({ message, type = 'success', onDismiss }) {
  const Icon = ICONS[type] || Info;
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon"><Icon size={18} /></span>
      <span>{message}</span>
      <button className="toast-dismiss" onClick={onDismiss} aria-label="Dismiss notification">
        <X size={14} />
      </button>
    </div>
  );
}
