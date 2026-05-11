import {
  useEffect,
  useState,
} from 'react';

import {
  Trophy,
  Medal,
  Crown,
} from 'lucide-react';

import api from '../../services/api.js';

export default function Leaderboard() {

  const [leaders,
    setLeaders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    loadLeaderboard();

  }, []);

  const loadLeaderboard =
    async () => {

      try {

        const res =
          await api.get(
            '/attempts/leaderboard'
          );

        setLeaders(
          res.data || []
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
      <div className="flex min-h-screen items-center justify-center bg-black text-white">

        <h1 className="text-3xl font-bold">

          Loading Leaderboard...

        </h1>

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

        <h1 className="text-6xl font-black">

          Leaderboard

        </h1>

        <p className="mt-3 text-xl opacity-70">

          Top Performing Students

        </p>

      </div>

      {/* EMPTY */}

      {leaders.length === 0 && (

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

          <h2 className="text-3xl font-bold">

            No Results Yet

          </h2>

        </div>
      )}

      {/* LIST */}

      <div className="space-y-6">

        {leaders.map(
          (
            student,
            index
          ) => (

            <div
              key={student._id}

              className={`flex flex-col gap-5 rounded-3xl border p-6 lg:flex-row lg:items-center lg:justify-between ${
                index === 0
                  ? 'border-yellow-500/30 bg-yellow-500/10'
                  : index === 1
                    ? 'border-gray-400/30 bg-gray-400/10'
                    : index === 2
                      ? 'border-orange-500/30 bg-orange-500/10'
                      : 'border-white/10 bg-white/5'
              }`}
            >

              {/* LEFT */}

              <div className="flex items-center gap-5">

                {/* RANK */}

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black ${
                    index === 0
                      ? 'bg-yellow-500 text-black'
                      : index === 1
                        ? 'bg-gray-300 text-black'
                        : index === 2
                          ? 'bg-orange-500 text-black'
                          : 'bg-white/10 text-white'
                  }`}
                >

                  {index + 1}

                </div>

                {/* INFO */}

                <div>

                  <h2 className="text-3xl font-bold">

                    {
                      student.user
                        ?.name
                    }

                  </h2>

                  <p className="mt-1 opacity-60">

                    {
                      student.user
                        ?.email
                    }

                  </p>

                  <p className="mt-2 text-blue-400">

                    {
                      student.exam
                        ?.title
                    }

                  </p>

                </div>

              </div>

              {/* CENTER */}

              <div className="text-center">

                <p className="text-lg opacity-70">

                  Score

                </p>

                <h2 className="mt-2 text-5xl font-black text-green-400">

                  {
                    student.score
                  }

                </h2>

              </div>

              {/* RIGHT */}

              <div>

                {index === 0 && (

                  <div className="flex items-center gap-3 rounded-full bg-yellow-500/20 px-5 py-3 text-yellow-400">

                    <Crown />

                    Champion

                  </div>
                )}

                {index === 1 && (

                  <div className="flex items-center gap-3 rounded-full bg-gray-400/20 px-5 py-3 text-gray-300">

                    <Medal />

                    Runner Up

                  </div>
                )}

                {index === 2 && (

                  <div className="flex items-center gap-3 rounded-full bg-orange-500/20 px-5 py-3 text-orange-400">

                    <Trophy />

                    Third Rank

                  </div>
                )}

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}