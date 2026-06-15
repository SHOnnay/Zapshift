import { Link, useRouteError } from 'react-router';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf4] courier-grid px-4">
      <section className="relative max-w-xl overflow-hidden rounded-[2.5rem] border border-secondary/10 bg-white p-8 text-center shadow-2xl shadow-secondary/10 md:p-10">
        <div className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative z-10">
          <div className="mx-auto mb-5 grid size-20 place-items-center rounded-3xl bg-error/10 text-4xl">⚠️</div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-error">Route interrupted</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-secondary">This page could not be loaded</h1>
          <p className="mt-4 text-sm font-semibold leading-7 text-secondary/60">
            {error?.statusText || error?.message || 'The courier page failed to load. Please return to the dashboard or homepage.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="btn btn-primary rounded-full px-8 font-black text-secondary shadow-lg shadow-primary/30">Back to Dashboard</Link>
            <Link to="/" className="btn rounded-full border-secondary/10 bg-secondary/5 px-8 font-black text-secondary hover:bg-secondary hover:text-white">Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
