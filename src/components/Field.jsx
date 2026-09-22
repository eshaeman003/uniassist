import { AlertCircle } from 'lucide-react';

/** Generic field wrapper: label + hint/error + child input. */
export default function Field({ label, htmlFor, hint, error, optional, children }) {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={htmlFor}>
          {label} {optional && <span className="optional">(optional)</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="field-error">
          <AlertCircle size={13} /> {error}
        </span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </div>
  );
}
