import {
  useState,
} from 'react';

export default function AIGenerator() {

  // =========================
  // STATES
  // =========================

  const [topic, setTopic] =
    useState('');

  const [difficulty,
    setDifficulty] =
    useState('easy');

  const [count,
    setCount] =
    useState(5);

  const [questions,
    setQuestions] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  // =========================
  // GENERATE QUESTIONS
  // =========================

  const generateQuestions =
    () => {

      if (!topic) {

        alert(
          'Please enter topic'
        );

        return;
      }

      setLoading(true);

      setTimeout(() => {

        const generated =
          Array.from({
            length: Number(
              count
            ),
          }).map((_, index) => ({

            question:
              `${topic} Question ${
                index + 1
              } (${difficulty})`,

            options: [

              `${topic} Option A`,
              `${topic} Option B`,
              `${topic} Option C`,
              `${topic} Option D`,
            ],

            answer:
              `${topic} Option A`,
          }));

        setQuestions(
          generated
        );

        setLoading(false);

      }, 1000);
    };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen space-y-8 bg-black p-8 text-white">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div>

        <h1 className="text-5xl font-black">

          AI Question Generator

        </h1>

        <p className="mt-3 text-lg opacity-70">

          Generate smart MCQs instantly

        </p>

      </div>

      {/* ========================= */}
      {/* FORM */}
      {/* ========================= */}

      <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:grid-cols-3">

        {/* TOPIC */}

        <div>

          <label className="mb-3 block text-sm opacity-70">

            Topic

          </label>

          <input
            value={topic}
            onChange={(e) =>
              setTopic(
                e.target.value
              )
            }
            placeholder="Enter topic"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
          />

        </div>

        {/* DIFFICULTY */}

        <div>

          <label className="mb-3 block text-sm opacity-70">

            Difficulty

          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
          >

            <option value="easy">

              Easy

            </option>

            <option value="medium">

              Medium

            </option>

            <option value="hard">

              Hard

            </option>

          </select>

        </div>

        {/* QUESTION COUNT */}

        <div>

          <label className="mb-3 block text-sm opacity-70">

            Number of Questions

          </label>

          <input
            type="number"
            value={count}
            onChange={(e) =>
              setCount(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
          />

        </div>

      </div>

      {/* ========================= */}
      {/* BUTTON */}
      {/* ========================= */}

      <button
        onClick={
          generateQuestions
        }
        disabled={loading}
        className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 text-lg font-bold transition-all hover:scale-105 disabled:opacity-50"
      >

        {loading
          ? 'Generating...'
          : 'Generate Questions'}

      </button>

      {/* ========================= */}
      {/* GENERATED QUESTIONS */}
      {/* ========================= */}

      <div className="space-y-6">

        {questions.map(
          (q, index) => (

            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >

              {/* QUESTION */}

              <h2 className="text-2xl font-bold">

                Q{index + 1}.
                {' '}
                {q.question}

              </h2>

              {/* OPTIONS */}

              <div className="mt-5 space-y-3">

                {q.options.map(
                  (opt, i) => (

                    <div
                      key={i}
                      className={`rounded-2xl border p-4 ${
                        opt ===
                        q.answer
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-white/10'
                      }`}
                    >

                      {opt}

                    </div>
                  )
                )}

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}