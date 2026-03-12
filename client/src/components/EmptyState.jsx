const EmptyState = ({ title, subtitle, action }) => {
  return (
    <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-10 text-center">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
