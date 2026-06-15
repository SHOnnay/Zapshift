const PageLoader = ({ message = 'Loading ZapShift...' }) => {
  return (
    <div className="flex min-h-[45vh] items-center justify-center px-4">
      <div className="rounded-3xl border border-base-300 bg-base-100/80 p-8 text-center shadow-xl">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 font-semibold text-secondary">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
