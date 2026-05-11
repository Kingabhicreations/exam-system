import {
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  useAuth,
} from '../context/AuthContext.jsx';

export default function Login() {

  // =========================
  // AUTH
  // =========================

  const {
    login,
  } = useAuth();

  const navigate =
    useNavigate();

  // =========================
  // STATES
  // =========================

  const [form,
    setForm] =
    useState({

      email: '',

      password: '',
    });

  const [loading,
    setLoading] =
    useState(false);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  // =========================
  // SUBMIT
  // =========================

  const submit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        // LOGIN

        const user =
          await login(

            form.email,

            form.password
          );

        console.log(
          'LOGIN USER:',
          user
        );

        toast.success(
          'Login Successful'
        );

        // REDIRECT

        if (
          user?.role ===
          'admin'
        ) {

          navigate(
            '/admin'
          );

        } else {

          navigate(
            '/dashboard'
          );
        }

      } catch (error) {

        console.log(error);

        toast.error(

          error.response?.data
            ?.message ||

          'Login Failed'
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // UI
  // =========================

  return (

    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">

      {/* TITLE */}

      <div>

        <h1 className="text-4xl font-bold">

          Welcome Back

        </h1>

        <p className="mt-2 opacity-70">

          Login to continue

        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={
          submit
        }

        className="mt-8 space-y-5"
      >

        {/* EMAIL */}

        <div>

          <label className="mb-2 block text-sm opacity-70">

            Email

          </label>

          <input
            type="email"

            name="email"

            required

            placeholder="Enter your email"

            value={
              form.email
            }

            onChange={
              handleChange
            }

            className="w-full rounded-2xl bg-white/10 p-4 outline-none"
          />

        </div>

        {/* PASSWORD */}

        <div>

          <label className="mb-2 block text-sm opacity-70">

            Password

          </label>

          <input
            type="password"

            name="password"

            required

            placeholder="Enter your password"

            value={
              form.password
            }

            onChange={
              handleChange
            }

            className="w-full rounded-2xl bg-white/10 p-4 outline-none"
          />

        </div>

        {/* BUTTON */}

        <button
          disabled={
            loading
          }

          className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold transition hover:bg-blue-700"
        >

          {loading
            ? 'Signing In...'
            : 'Sign In'}

        </button>

      </form>

      {/* REGISTER */}

      <p className="mt-6 text-center text-sm opacity-70">

        New here?
        {' '}

        <Link
          to="/register"

          className="font-semibold text-blue-400 hover:text-blue-300"
        >

          Create Account

        </Link>

      </p>

    </div>
  );
}