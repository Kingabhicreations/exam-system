import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

export default function AdminQuestions() {
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState('');
  const [items, setItems] = useState(null);
  const [text, setText] = useState('');
  const [options, setOptions] = useState([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);

  useEffect(() => { api.get('/exams?scope=all').then((r) => setExams(r.data.items)); }, []);
  useEffect(() => { if (examId) api.get(`/questions?exam=${examId}`).then((r) => setItems(r.data.items)); }, [examId]);

  const add = async (e) => {
    e.preventDefault();
    if (!examId) return toast.error('Pick an exam');
    await api.post('/questions', { exam: examId, type: 'mcq-single', text, options, marks: 1 });
    toast.success('Question added');
    setText(''); setOptions([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
    api.get(`/questions?exam=${examId}`).then((r) => setItems(r.data.items));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Questions</h1>
      <select className="input max-w-sm" value={examId} onChange={(e) => setExamId(e.target.value)}>
        <option value="">Select an exam…</option>
        {exams.map((e) => <option key={e._id} value={e._id}>{e.title}</option>)}
      </select>

      {examId && (
        <form onSubmit={add} className="glass space-y-3 rounded-2xl p-5">
          <input className="input" placeholder="Question text" required value={text} onChange={(e) => setText(e.target.value)} />
          {options.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className="input flex-1" placeholder={`Option ${i + 1}`} value={o.text}
                onChange={(e) => { const c = [...options]; c[i].text = e.target.value; setOptions(c); }} />
              <label className="text-sm flex items-center gap-1">
                <input type="radio" name="correct" checked={o.isCorrect}
                  onChange={() => setOptions(options.map((x, j) => ({ ...x, isCorrect: j === i })))} />
                Correct
              </label>
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" onClick={() => setOptions([...options, { text: '', isCorrect: false }])}>+ Option</button>
            <button className="btn-primary ml-auto">Add question</button>
          </div>
        </form>
      )}

      {items && (
        <div className="space-y-2">
          {items.map((q) => (
            <div key={q._id} className="glass rounded-xl p-4">
              <div className="font-medium">{q.text}</div>
              <ul className="mt-2 text-sm opacity-80">
                {q.options.map((o) => (
                  <li key={o._id}>{o.isCorrect ? '✓' : '·'} {o.text}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
