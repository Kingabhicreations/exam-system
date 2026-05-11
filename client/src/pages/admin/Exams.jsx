import {
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import api from '../../services/api.js';

export default function AdminExams() {

  // =========================
  // STATES
  // =========================

  const [exams,
    setExams] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [creating,
    setCreating] =
    useState(false);

  const [form,
    setForm] =
    useState({

      title: '',

      description: '',

      duration: 30,
    });

  // =========================
  // LOAD EXAMS
  // =========================

  useEffect(() => {

    loadExams();

  }, []);

  const loadExams =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            '/exams'
          );

        console.log(
          'EXAMS:',
          res.data
        );

        // HANDLE BOTH ARRAY + OBJECT

        const examData =
          Array.isArray(
            res.data
          )

            ? res.data

            : res.data.items || [];

        setExams(
          examData
        );

      } catch (error) {

        console.log(error);

        toast.error(
          'Failed to load exams'
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // CREATE EXAM
  // =========================

  const createExam =
    async (e) => {

      e.preventDefault();

      try {

        setCreating(true);

        await api.post(
          '/exams',
          {

            title:
              form.title,

            description:
              form.description,

            duration:
              Number(
                form.duration
              ),
          }
        );

        toast.success(
          'Exam Created'
        );

        // RESET FORM

        setForm({

          title: '',

          description: '',

          duration: 30,
        });

        // RELOAD

        loadExams();

      } catch (error) {

        console.log(error);

        toast.error(

          error.response?.data
            ?.message ||

          'Create Failed'
        );

      } finally {

        setCreating(false);
      }
    };

  // =========================
  // DELETE EXAM
  // =========================

  const deleteExam =
    async (id) => {

      try {

        const confirmDelete =
          window.confirm(
            'Delete this exam?'
          );

        if (
          !confirmDelete
        ) return;

        console.log(
          'Deleting:',
          id
        );

        const res =
          await api.delete(
            `/exams/${id}`
          );

        console.log(
          res.data
        );

        toast.success(
          'Exam Deleted'
        );

        // REMOVE FROM UI

        setExams(
          (prev) =>

            prev.filter(
              (exam) =>
                exam._id !==
                id
            )
        );

      } catch (error) {

        console.log(error);

        toast.error(

          error.response?.data
            ?.message ||

          'Delete Failed'
        );
      }
    };

  // =========================
  // UI
  // =========================

  return (

    <div className="space-y-10 text-white">

      {/* HEADER */}

      <div>

        <h1 className="text-4xl font-bold">

          Manage Exams

        </h1>

        <p className="mt-2 opacity-70">

          Create and manage exams

        </p>

      </div>

      {/* CREATE FORM */}

      <form
        onSubmit={
          createExam
        }

        className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8"
      >

        {/* TITLE */}

        <input
          type="text"

          required

          placeholder="Exam Title"

          value={
            form.title
          }

          onChange={(e) =>
            setForm({

              ...form,

              title:
                e.target.value,
            })
          }

          className="w-full rounded-2xl bg-white/10 p-4 outline-none"
        />

        {/* DESCRIPTION */}

        <textarea
          placeholder="Description"

          value={
            form.description
          }

          onChange={(e) =>
            setForm({

              ...form,

              description:
                e.target.value,
            })
          }

          className="h-32 w-full rounded-2xl bg-white/10 p-4 outline-none"
        />

        {/* DURATION */}

        <input
          type="number"

          min="1"

          placeholder="Duration"

          value={
            form.duration
          }

          onChange={(e) =>
            setForm({

              ...form,

              duration:
                e.target.value,
            })
          }

          className="w-full rounded-2xl bg-white/10 p-4 outline-none"
        />

        {/* BUTTON */}

        <button
          disabled={
            creating
          }

          className="rounded-2xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-700"
        >

          {creating
            ? 'Creating...'
            : 'Create Exam'}

        </button>

      </form>

      {/* EXAMS */}

      <div className="grid gap-6">

        {loading ? (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

            Loading Exams...

          </div>

        ) : exams.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

            No Exams Found

          </div>

        ) : (

          exams.map(
            (exam) => (

              <div
                key={exam._id}

                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  {/* LEFT */}

                  <div>

                    <h2 className="text-2xl font-bold">

                      {
                        exam.title
                      }

                    </h2>

                    <p className="mt-2 opacity-70">

                      {
                        exam.description
                      }

                    </p>

                    <p className="mt-4 text-blue-400">

                      Duration:
                      {' '}
                      {
                        exam.duration
                      }
                      {' '}
                      min

                    </p>

                  </div>

                  {/* RIGHT */}

                  <button

                    type="button"

                    onClick={() =>
                      deleteExam(
                        exam._id
                      )
                    }

                    className="rounded-2xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
                  >

                    Delete

                  </button>

                </div>

              </div>
            )
          )
        )}

      </div>

    </div>
  );
}