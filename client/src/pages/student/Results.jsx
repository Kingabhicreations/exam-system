import {
  useEffect,
  useState,
} from 'react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

import api from '../../services/api.js';

export default function StudentResults() {

  // =========================
  // STATES
  // =========================

  const [attempts, setAttempts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD RESULTS
  // =========================

  useEffect(() => {

    loadResults();

  }, []);

  const loadResults = async () => {

    try {

      const res = await api.get(
        '/attempts/me'
      );

      setAttempts(
        res.data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // PDF DOWNLOAD
  // =========================

  const downloadPDF =
    async () => {

      const input =
        document.getElementById(
          'results-section'
        );

      if (!input) return;

      const canvas =
        await html2canvas(
          input
        );

      const imgData =
        canvas.toDataURL(
          'image/png'
        );

      const pdf =
        new jsPDF(
          'p',
          'mm',
          'a4'
        );

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (canvas.height *
          pdfWidth) /
        canvas.width;

      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(
        'exam-results.pdf'
      );
    };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="p-10 text-white">

        Loading Results...

      </div>
    );
  }

  // =========================
  // EMPTY
  // =========================

  if (attempts.length === 0) {

    return (
      <div className="p-10 text-white">

        No Results Found

      </div>
    );
  }

  // =========================
  // CHART DATA
  // =========================

  const chartData =
    attempts.map((a) => ({

      name:
        a.exam?.title ||
        'Exam',

      score:
        a.score || 0,

    }));

  // =========================
  // STATS
  // =========================

  const totalExams =
    attempts.length;

  const totalScore =
    attempts.reduce(
      (acc, cur) =>
        acc + (cur.score || 0),
      0
    );

  const averageScore =
    Math.round(
      totalScore /
        totalExams
    );

  const highestScore =
    Math.max(
      ...attempts.map(
        (a) =>
          a.score || 0
      )
    );

  // =========================
  // UI
  // =========================

  return (
    <div
      id="results-section"
      className="min-h-screen space-y-8 bg-black p-8 text-white"
    >

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-5xl font-black">

            My Results

          </h1>

          <p className="mt-3 text-lg opacity-70">

            Track your exam
            performance analytics

          </p>

        </div>

        {/* DOWNLOAD BUTTON */}

        <button
          onClick={downloadPDF}
          className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 text-lg font-bold transition-all hover:scale-105"
        >

          Download PDF

        </button>

      </div>

      {/* ========================= */}
      {/* STATS */}
      {/* ========================= */}

      <div className="grid gap-6 md:grid-cols-3">

        {/* TOTAL EXAMS */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <h2 className="text-lg opacity-70">

            Total Exams

          </h2>

          <p className="mt-5 text-6xl font-black">

            {totalExams}

          </p>

        </div>

        {/* AVG SCORE */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <h2 className="text-lg opacity-70">

            Average Score

          </h2>

          <p className="mt-5 text-6xl font-black text-green-400">

            {averageScore}

          </p>

        </div>

        {/* HIGHEST SCORE */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <h2 className="text-lg opacity-70">

            Highest Score

          </h2>

          <p className="mt-5 text-6xl font-black text-blue-400">

            {highestScore}

          </p>

        </div>

      </div>

      {/* ========================= */}
      {/* CHART */}
      {/* ========================= */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

        <h2 className="mb-8 text-4xl font-bold">

          Performance Analytics

        </h2>

        <div className="h-[400px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={chartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="score"
                radius={[
                  10,
                  10,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ========================= */}
      {/* RESULT CARDS */}
      {/* ========================= */}

      <div className="grid gap-6">

        {attempts.map((a) => (

          <div
            key={a._id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:border-blue-500/30"
          >

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              {/* LEFT */}

              <div>

                <h2 className="text-3xl font-bold">

                  {a.exam?.title ||
                    'Exam'}

                </h2>

                <p className="mt-3 opacity-60">

                  Submitted:
                  {' '}

                  {new Date(
                    a.createdAt
                  ).toLocaleString()}

                </p>

              </div>

              {/* RIGHT */}

              <div className="text-right">

                <p className="text-lg opacity-70">

                  Score

                </p>

                <p className="text-6xl font-black text-green-400">

                  {a.score}

                </p>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}