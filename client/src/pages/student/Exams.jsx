import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../../services/api.js';

export default function StudentExams() {
  const [data, setData] = useState(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  // =========================
  // LOAD EXAMS
  // =========================

  const load = async () => {
    try {
      const res = await api.get(
        `/exams?page=${page}&limit=9&q=${encodeURIComponent(q)}`
      );

      setData(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    load();
  }, [page, q]);

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">
          Exams
        </h1>

        <input
          className="input max-w-xs"
          placeholder="Search…"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
      </div>

      {/* LOADING */}
      {!data ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-40"
            />
          ))}
        </div>
      ) : (
        <>
          {/* EXAMS GRID */}
          <div className="grid gap-4 md:grid-cols-3">

            {data.items?.map((e) => (
              <div
                key={e._id}
                className="glass rounded-2xl p-5"
              >
                <div className="font-semibold">
                  {e.title}
                </div>

                <div className="mt-1 text-xs opacity-60">
                  {e.durationMinutes} min ·{' '}
                  {e.totalMarks} marks
                </div>

                <p className="mt-2 line-clamp-3 text-sm opacity-80">
                  {e.description}
                </p>

                {/* START BUTTON */}
                <Link
                  to={`/exam/${e._id}`}
                  className="btn-primary mt-4 block w-full text-center"
                >
                  Start Exam
                </Link>
              </div>
            ))}

            {/* EMPTY */}
            {data.items?.length === 0 && (
              <div className="opacity-60">
                No exams found.
              </div>
            )}

          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-2">

            <button
              className="btn-ghost"
              disabled={page === 1}
              onClick={() =>
                setPage((p) => p - 1)
              }
            >
              Prev
            </button>

            <span className="px-3 py-2 text-sm opacity-60">
              Page {page}
            </span>

            <button
              className="btn-ghost"
              onClick={() =>
                setPage((p) => p + 1)
              }
            >
              Next
            </button>

          </div>
        </>
      )}
    </div>
  );
}