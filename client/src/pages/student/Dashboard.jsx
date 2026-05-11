import {
  useEffect,
  useState,
} from 'react';

import api from '../../services/api.js';

export default function StudentDashboard() {

  // =========================
  // STATES
  // =========================

  const [exams, setExams] =
    useState([]);

  const [attempts, setAttempts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      // FETCH EXAMS

      const examsRes =
        await api.get(
          '/exams?limit=4'
        );

      // FETCH ATTEMPTS

      const attemptsRes =
        await api.get(
          '/attempts/me'
        );

      setExams(
        examsRes.data.items || []
      );

      setAttempts(
        attemptsRes.data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="p-10 text-white">

        Loading Dashboard...

      </div>
    );
  }

  // =========================
  // CALCULATIONS
  // =========================

  const totalAttempts =
    attempts.length;

  const totalScore =
    attempts.reduce(
      (acc, cur) =>
        acc + (cur.score || 0),
      0
    );

  const avgScore =
    totalAttempts > 0
      ? Math.round(
          totalScore /
            totalAttempts
        )
      : 0;

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen space-y-8 bg-black text-white">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div>

        <h1 className="text-5xl font-black">

          Welcome back 👋

        </h1>

        <p className="mt-3 text-lg opacity-60">

          Track your exam
          progress and
          performance

        </p>

      </div>

      {/* ========================= */}
      {/* STATS */}
      {/* ========================= */}

      <div className="grid gap-6 md:grid-cols-3">

        {/* AVAILABLE EXAMS */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <p className="text-sm uppercase tracking-widest opacity-50">

            Available Exams

          </p>

          <h2 className="mt-5 text-6xl font-black">

            {exams.length}

          </h2>

        </div>

        {/* ATTEMPTS */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <p className="text-sm uppercase tracking-widest opacity-50">

            Attempts

          </p>

          <h2 className="mt-5 text-6xl font-black text-blue-400">

            {totalAttempts}

          </h2>

        </div>

        {/* AVG SCORE */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <p className="text-sm uppercase tracking-widest opacity-50">

            AVG Score

          </p>

          <h2 className="mt-5 text-6xl font-black text-green-400">

            {avgScore}

          </h2>

        </div>

      </div>

      {/* ========================= */}
      {/* LATEST EXAMS */}
      {/* ========================= */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-bold">

            Latest Exams

          </h2>

        </div>

        <div className="space-y-5">

          {exams.map((e) => (

            <div
              key={e._id}
              className="rounded-2xl border border-white/10 bg-black/30 p-5 transition-all hover:border-blue-500/30"
            >

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <h3 className="text-2xl font-bold">

                    {e.title}

                  </h3>

                  <p className="mt-2 opacity-60">

                    {e.durationMinutes}
                    {' '}
                    min
                    ·
                    {' '}
                    {e.totalMarks}
                    {' '}
                    marks

                  </p>

                </div>

                <div className="rounded-full bg-blue-500/20 px-5 py-2 text-sm font-bold text-blue-400">

                  Active

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}