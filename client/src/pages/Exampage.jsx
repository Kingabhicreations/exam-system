import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import api from '../services/api.js';

export default function ExamPage() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  // =========================
  // STATES
  // =========================

  const [exam,
    setExam] =
    useState(null);

  const [questions,
    setQuestions] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [answers,
    setAnswers] =
    useState({});

  const [submitting,
    setSubmitting] =
    useState(false);

  const [warnings,
    setWarnings] =
    useState(0);

  const [examClosed,
    setExamClosed] =
    useState(false);

  const [cameraEnabled,
    setCameraEnabled] =
    useState(false);

  const [timeLeft,
    setTimeLeft] =
    useState(0);

  // =========================
  // REFS
  // =========================

  const videoRef =
    useRef(null);

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    loadExam();

    startCamera();

    startFullscreen();

    disableRightClick();

    detectTabSwitch();

  }, []);

  // =========================
  // LOAD EXAM
  // =========================

  const loadExam =
    async () => {

      try {

        // =========================
        // EXAM DETAILS
        // =========================

        const examRes =
          await api.get(
            `/exams/${id}`
          );

        setExam(
          examRes.data
        );

        setTimeLeft(
          examRes.data
            .duration * 60
        );

        // =========================
        // QUESTIONS
        // =========================

        const questionRes =
          await api.get(
            `/questions?exam=${id}`
          );

        setQuestions(

          questionRes.data
            .items || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // TIMER
  // =========================

  useEffect(() => {

    if (
      loading ||
      examClosed
    ) return;

    if (
      timeLeft <= 0
    ) {

      alert(
        'Time Up! Auto Submitting Exam'
      );

      handleSubmit();

      return;
    }

    const timer =
      setInterval(() => {

        setTimeLeft(
          (prev) =>
            prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [
    timeLeft,
    loading,
    examClosed,
  ]);

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime =
    (seconds) => {

      const mins =
        Math.floor(
          seconds / 60
        );

      const secs =
        seconds % 60;

      return `${mins}:${
        secs < 10
          ? '0'
          : ''
      }${secs}`;
    };

  // =========================
  // CAMERA
  // =========================

  const startCamera =
    async () => {

      try {

        const stream =
          await navigator.mediaDevices.getUserMedia({

            video: true,
          });

        if (
          videoRef.current
        ) {

          videoRef.current.srcObject =
            stream;
        }

        setCameraEnabled(
          true
        );

      } catch (error) {

        console.log(error);

        addWarning(
          'Camera Disabled'
        );
      }
    };

  // =========================
  // FULLSCREEN
  // =========================

  const startFullscreen =
    () => {

      const elem =
        document.documentElement;

      if (
        elem.requestFullscreen
      ) {

        elem.requestFullscreen();
      }
    };

  // =========================
  // DISABLE RIGHT CLICK
  // =========================

  const disableRightClick =
    () => {

      document.addEventListener(
        'contextmenu',

        (e) => {

          e.preventDefault();
        }
      );
    };

  // =========================
  // TAB SWITCH DETECTION
  // =========================

  const detectTabSwitch =
    () => {

      document.addEventListener(

        'visibilitychange',

        () => {

          if (
            document.hidden
          ) {

            addWarning(
              'Tab Switching Detected'
            );
          }
        }
      );
    };

  // =========================
  // WARNING SYSTEM
  // =========================

  const addWarning =
    (reason) => {

      alert(
        `Warning: ${reason}`
      );

      setWarnings(
        (prev) => {

          const updated =
            prev + 1;

          // =========================
          // AUTO TERMINATE
          // =========================

          if (
            updated >= 3
          ) {

            alert(
              'Exam Closed Due To Multiple Warnings'
            );

            setExamClosed(
              true
            );

            handleSubmit();
          }

          return updated;
        }
      );
    };

  // =========================
  // HANDLE ANSWERS
  // =========================

  const handleAnswer =
    (
      questionId,
      optionId
    ) => {

      setAnswers(
        (prev) => ({

          ...prev,

          [questionId]:
            optionId,
        })
      );
    };

  // =========================
  // SUBMIT EXAM
  // =========================

  const handleSubmit =
    async () => {

      try {

        // PREVENT MULTIPLE SUBMIT

        if (
          submitting
        ) return;

        setSubmitting(
          true
        );

        // =========================
        // FORMAT ANSWERS
        // =========================

        const formattedAnswers =
          Object.keys(
            answers
          ).map(
            (
              questionId
            ) => ({

              question:
                questionId,

              selectedOption:
                answers[
                  questionId
                ],
            })
          );

        console.log(
          'Submitting:',
          formattedAnswers
        );

        // =========================
        // SUBMIT API
        // =========================

        const res =
          await api.post(
            '/attempts',
            {

              exam: id,

              answers:
                formattedAnswers,

              warnings,
            }
          );

        console.log(
          res.data
        );

        // =========================
        // STOP CAMERA
        // =========================

        if (
          videoRef.current &&
          videoRef.current.srcObject
        ) {

          const tracks =
            videoRef.current
              .srcObject
              .getTracks();

          tracks.forEach(
            (track) =>
              track.stop()
          );
        }

        // =========================
        // EXIT FULLSCREEN
        // =========================

        if (
          document.fullscreenElement
        ) {

          document.exitFullscreen();
        }

        alert(
          'Exam Submitted Successfully'
        );

        navigate(
          '/results'
        );

      } catch (error) {

        console.log(error);

        alert(

          error?.response?.data
            ?.message ||

          'Submit Failed'
        );

      } finally {

        setSubmitting(
          false
        );
      }
    };

  // =========================
  // EXAM TERMINATED
  // =========================

  if (
    examClosed
  ) {

    return (

      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">

        <h1 className="text-6xl font-black text-red-500">

          Exam Terminated

        </h1>

        <p className="mt-5 text-2xl opacity-70">

          Too many warnings detected

        </p>

      </div>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (
    loading
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-black text-white">

        <h1 className="text-4xl font-bold">

          Loading Exam...

        </h1>

      </div>
    );
  }

  // =========================
  // EMPTY
  // =========================

  if (
    questions.length === 0
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-black text-white">

        <h1 className="text-4xl font-bold">

          No Questions Found

        </h1>

      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div className="min-h-screen bg-black p-8 text-white">

      {/* TOP CENTER TIMER */}

      <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2">

        <div className="rounded-full border border-red-400/40 bg-red-500 px-10 py-5 text-4xl font-black text-white shadow-2xl backdrop-blur">

          ⏰
          {' '}
          {
            formatTime(
              timeLeft
            )
          }

        </div>

      </div>

      {/* CAMERA */}

      <div className="fixed right-5 top-5 z-50 overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl">

        <video
          ref={videoRef}

          autoPlay

          muted

          className="h-[160px] w-[220px] object-cover"
        />

      </div>

      {/* HEADER */}

      <div className="mb-10 mt-24">

        <h1 className="text-5xl font-black">

          {
            exam?.title
          }

        </h1>

        <p className="mt-3 text-lg opacity-70">

          Duration:
          {' '}
          {
            exam?.duration
          }
          Minutes

        </p>

        <p className="mt-2 opacity-70">

          Questions:
          {' '}
          {
            questions.length
          }

        </p>

      </div>

      {/* WARNING BAR */}

      <div className="mb-10 flex items-center justify-between rounded-3xl border border-red-500/30 bg-red-500/10 p-6">

        <h2 className="text-2xl font-bold text-red-400">

          Warnings:
          {' '}
          {
            warnings
          }
          /3

        </h2>

        <div className="flex items-center gap-3">

          <div className={`h-4 w-4 rounded-full ${
            cameraEnabled
              ? 'bg-green-500'
              : 'bg-red-500'
          }`} />

          <p className="text-lg">

            {
              cameraEnabled
                ? 'Live Monitoring'
                : 'Camera Off'
            }

          </p>

        </div>

      </div>

      {/* QUESTIONS */}

      <div className="space-y-8">

        {questions.map(
          (
            q,
            index
          ) => (

            <div
              key={q._id}

              className="rounded-3xl border border-white/10 bg-white/5 p-8"
            >

              {/* QUESTION */}

              <h2 className="text-2xl font-bold">

                Q{index + 1}.
                {' '}
                {q.text}

              </h2>

              {/* OPTIONS */}

              <div className="mt-6 space-y-4">

                {Array.isArray(
                  q.options
                ) &&

                  q.options.map(
                    (opt) => (

                      <label
                        key={
                          opt._id
                        }

                        className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                          answers[
                            q._id
                          ] ===
                          opt._id
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >

                        <input
                          type="radio"

                          name={
                            q._id
                          }

                          checked={
                            answers[
                              q._id
                            ] ===
                            opt._id
                          }

                          onChange={() =>
                            handleAnswer(
                              q._id,
                              opt._id
                            )
                          }
                        />

                        <span className="text-lg">

                          {
                            opt.text
                          }

                        </span>

                      </label>
                    )
                  )}

              </div>

            </div>
          )
        )}

      </div>

      {/* SUBMIT */}

      <button
        disabled={
          examClosed ||
          submitting
        }

        onClick={
          handleSubmit
        }

        className="mt-10 w-full rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 py-5 text-2xl font-black"
      >

        {submitting
          ? 'Submitting...'
          : 'Submit Exam'}

      </button>

    </div>
  );
}