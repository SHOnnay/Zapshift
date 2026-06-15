import { Link } from 'react-router';

const EmptyState = ({ title, message, actionLabel, actionTo }) => {
  return (
    <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/25 text-3xl">📦</div>
      <h3 className="text-2xl font-bold text-secondary">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-base-content/70">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary mt-6 rounded-full text-secondary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
