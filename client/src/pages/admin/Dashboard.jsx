import {
  useEffect,
  useState,
} from 'react';

import api from '../../services/api.js';

export default function Dashboard() {

  const [stats,
    setStats] =
    useState({

      exams: 0,

      students: 0,

      published: 0,
    });

  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard =
    async () => {

      try {

        // =========================
        // EXAMS
        // =========================

        const examsRes =
          await api.get(
            '/exams'
          );

        console.log(
          'EXAMS:',
          examsRes.data
        );

        // HANDLE BOTH TYPES

        const exams =
          Array.isArray(
            examsRes.data
          )

            ? examsRes.data

            : examsRes.data.items || [];

        // =========================
        // USERS
        // =========================

        const usersRes =
          await api.get(
            '/users'
          );

        const users =
          Array.isArray(
            usersRes.data
          )

            ? usersRes.data

            : [];

        // =========================
        // STUDENTS
        // =========================

        const students =
          users.filter(
            (u) =>
              u.role ===
              'student'
          );

        // =========================
        // SET STATS
        // =========================

        setStats({

          exams:
            exams.length,

          students:
            students.length,

          published:
            exams.length,
        });

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div className="space-y-10 text-white">

      {/* TITLE */}

      <div>

        <h1 className="text-5xl font-black">

          Admin overview

        </h1>

      </div>

      {/* STATS */}

      <div className="grid gap-6 md:grid-cols-3">

        {/* TOTAL EXAMS */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <p className="text-lg uppercase opacity-70">

            Total Exams

          </p>

          <h2 className="mt-5 text-6xl font-black text-blue-400">

            {
              stats.exams
            }

          </h2>

        </div>

        {/* STUDENTS */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <p className="text-lg uppercase opacity-70">

            Students

          </p>

          <h2 className="mt-5 text-6xl font-black text-green-400">

            {
              stats.students
            }

          </h2>

        </div>

        {/* PUBLISHED */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <p className="text-lg uppercase opacity-70">

            Published

          </p>

          <h2 className="mt-5 text-6xl font-black text-purple-400">

            {
              stats.published
            }

          </h2>

        </div>

      </div>

    </div>
  );
}