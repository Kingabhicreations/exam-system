import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center">
      <div className="glass mx-auto max-w-3xl rounded-3xl p-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          The modern <span className="text-brand-600">online exam</span> platform
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Secure proctoring, instant results, beautiful analytics. Built for institutions
          that care about experience.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register" className="btn-primary">Start free</Link>
          <Link to="/about" className="btn-ghost">Learn more</Link>
        </div>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          ['Anti-cheat', 'Tab-switch & copy detection with auto-submit.'],
          ['Smart grading', 'MCQ, multi-select, true/false, short answer.'],
          ['Insights', 'Chart.js dashboards & leaderboards.'],
        ].map(([t, d]) => (
          <div key={t} className="glass rounded-2xl p-6 text-left">
            <div className="text-lg font-semibold">{t}</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
