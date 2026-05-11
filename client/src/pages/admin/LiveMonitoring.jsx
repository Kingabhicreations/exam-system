import {
  useEffect,
  useState,
} from 'react';

import api from '../../services/api.js';

export default function LiveMonitoring() {

  const [students,
    setStudents] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  // =========================
  // LOAD LIVE DATA
  // =========================

  const loadLiveData =
    async () => {

      try {

        const res =
          await api.get(
            '/attempts/live'
          );

        setStudents(
          res.data || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {

    loadLiveData();

    // REAL TIME UPDATE

    const interval =
      setInterval(() => {

        loadLiveData();

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">

        <div className="text-2xl font-bold">

          Loading Live Monitoring...

        </div>

      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-black p-8 text-white">

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-5xl font-black">

          Live Monitoring

        </h1>

        <p className="mt-3 text-lg opacity-70">

          Real-time AI Proctoring Dashboard

        </p>

      </div>

      {/* LIVE COUNT */}

      <div className="mb-10 grid gap-6 md:grid-cols-3">

        {/* ACTIVE */}

        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-6">

          <p className="text-lg opacity-70">

            Active Students

          </p>

          <h2 className="mt-3 text-5xl font-black text-green-400">

            {
              students.filter(
                (s) =>
                  s.status ===
                  'live'
              ).length
            }

          </h2>

        </div>

        {/* SUSPICIOUS */}

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">

          <p className="text-lg opacity-70">

            Suspicious Students

          </p>

          <h2 className="mt-3 text-5xl font-black text-red-400">

            {
              students.filter(
                (s) =>
                  s.status ===
                  'suspicious'
              ).length
            }

          </h2>

        </div>

        {/* SUBMITTED */}

        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">

          <p className="text-lg opacity-70">

            Submitted Exams

          </p>

          <h2 className="mt-3 text-5xl font-black text-blue-400">

            {
              students.filter(
                (s) =>
                  s.status ===
                  'submitted'
              ).length
            }

          </h2>

        </div>

      </div>

      {/* STUDENTS */}

      <div className="space-y-6">

        {students.map(
          (student) => (

            <div
              key={student.id}
              className={`rounded-3xl border p-6 transition-all duration-300 ${
                student.status ===
                'suspicious'
                  ? 'border-red-500/30 bg-red-500/10'
                  : student.status ===
                    'live'
                    ? 'border-yellow-500/20 bg-yellow-500/5'
                    : 'border-green-500/20 bg-green-500/5'
              }`}
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* LEFT */}

                <div>

                  <h2 className="text-3xl font-bold">

                    {student.student}

                  </h2>

                  <p className="mt-2 opacity-70">

                    {student.email}

                  </p>

                  <p className="mt-2 text-blue-400">

                    {student.exam}

                  </p>

                  {/* WARNINGS */}

                  <div
                    className={`mt-4 inline-flex rounded-2xl px-4 py-2 text-sm font-bold ${
                      student.warnings >= 3
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >

                    Warnings:
                    {' '}
                    {student.warnings}

                    {student.warnings >= 3 && (
                      <span className="ml-3">

                        ⚠ CHEATING DETECTED

                      </span>
                    )}

                  </div>

                </div>

                {/* SCORE */}

                <div className="text-center">

                  <p className="text-lg opacity-70">

                    Score

                  </p>

                  <h2 className="mt-2 text-5xl font-black text-green-400">

                    {student.score}

                  </h2>

                </div>

                {/* STATUS */}

                <div className="text-right">

                  <div
                    className={`inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-bold ${
                      student.status ===
                      'suspicious'
                        ? 'bg-red-500/20 text-red-400'
                        : student.status ===
                          'live'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                    }`}
                  >

                    <div
                      className={`h-3 w-3 animate-pulse rounded-full ${
                        student.status ===
                        'suspicious'
                          ? 'bg-red-500'
                          : student.status ===
                            'live'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                    />

                    {student.status ===
                    'suspicious'
                      ? 'SUSPICIOUS'
                      : student.status ===
                        'live'
                        ? 'LIVE'
                        : 'SUBMITTED'}

                  </div>

                  <p className="mt-4 text-sm opacity-60">

                    {new Date(
                      student.submittedAt
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}