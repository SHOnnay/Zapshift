import { Link, useRouteError } from 'react-router';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <section className="max-w-xl rounded-[2rem] bg-base-100 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl bg-error/10 text-4xl">⚠️</div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-error">Something went wrong</p>
        <h1 className="mt-3 text-4xl font-black text-secondary">Page could not be loaded</h1>
        <p className="mt-4 text-base-content/70">
          {error?.statusText || error?.message || 'The page failed to load. Please try again from the homepage.'}
        </p>
        <Link to="/" className="btn btn-primary mt-8 rounded-full px-8 text-secondary">Back to Home</Link>
      </section>
    </main>
  );
};

export default ErrorPage;
