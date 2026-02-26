const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-3xl bg-white p-5 shadow-card">
      <div className="h-36 w-full rounded-2xl bg-orange-100" />
      <div className="mt-4 h-4 w-2/3 rounded bg-orange-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-orange-100" />
    </div>
  );
};

export default SkeletonCard;
