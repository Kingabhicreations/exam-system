import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend,
} from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Dummy demo data — wire to /api/attempts/exam/:id once you have attempts.
const bar = {
  labels: ['Math', 'Physics', 'Chemistry', 'Biology', 'CS'],
  datasets: [{ label: 'Avg score', data: [78, 65, 71, 80, 88], backgroundColor: '#4f7cff' }],
};
const doughnut = {
  labels: ['Correct', 'Wrong', 'Skipped'],
  datasets: [{ data: [62, 25, 13], backgroundColor: ['#22c55e', '#ef4444', '#94a3b8'] }],
};

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6"><h2 className="mb-4 font-semibold">Subject performance</h2><Bar data={bar} /></div>
        <div className="glass rounded-2xl p-6"><h2 className="mb-4 font-semibold">Answer distribution</h2><Doughnut data={doughnut} /></div>
      </div>
    </div>
  );
}
