export default function Select({ error, className = '', children, ...rest }) {
  return (
    <select className={`select ${error ? 'has-error' : ''} ${className}`} {...rest}>
      {children}
    </select>
  );
}
