import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="glass max-w-xl rounded-2xl p-8">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4 space-y-2 text-sm">
        <div><span className="opacity-60">Name:</span> {user?.name}</div>
        <div><span className="opacity-60">Email:</span> {user?.email}</div>
        <div><span className="opacity-60">Role:</span> {user?.role}</div>
      </div>
    </div>
  );
}
