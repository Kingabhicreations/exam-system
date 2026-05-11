import { useEffect, useState } from 'react';
import api from '../../services/api.js';

export default function AdminStudents() {
  const [data, setData] = useState(null);
  const [q, setQ] = useState('');
  useEffect(() => {
    const t = setTimeout(() => api.get(`/users?q=${encodeURIComponent(q)}`).then((r) => setData(r.data)), 300);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <input className="input max-w-xs" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {!data ? <div className="skeleton h-40" /> : (
        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-white/10"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3">Role</th><th className="p-3">Verified</th></tr></thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u._id} className="border-t border-white/10">
                  <td className="p-3">{u.name}</td><td className="p-3">{u.email}</td>
                  <td className="p-3 text-center">{u.role}</td>
                  <td className="p-3 text-center">{u.isVerified ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
