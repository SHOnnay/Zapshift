import { Link } from 'react-router';

const NotFound = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <section className="relative max-w-xl overflow-hidden rounded-[2.5rem] border border-secondary/10 bg-white p-8 text-center shadow-2xl shadow-secondary/10 md:p-10">
        <div className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative z-10">
          <div className="mx-auto mb-5 grid size-20 place-items-center rounded-3xl bg-primary/15 text-4xl">📭</div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">404</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-secondary">Page not found</h1>
          <p className="mt-4 text-sm font-semibold leading-7 text-secondary/60">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn btn-primary rounded-full px-8 font-black text-secondary shadow-lg shadow-primary/30">Home</Link>
            <Link to="/dashboard" className="btn rounded-full border-secondary/10 bg-secondary/5 px-8 font-black text-secondary hover:bg-secondary hover:text-white">Dashboard</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;