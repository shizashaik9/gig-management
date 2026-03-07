import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { T } from './theme';

export default function CreateGig() {
  const [form, setForm] = useState({ title: '', description: '', price: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/gigs', form,
        { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ text: res.data.message, ok: true });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed', ok: false });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font }}>
      <Navbar />
      <div style={s.page}>
        <div style={s.card}>
          <h2 style={s.title}>Post a New Gig</h2>
          <p style={s.subtitle}>Describe your service and set your price</p>
          <form onSubmit={handleSubmit}>
            <div style={s.field}>
              <label style={s.label}>Gig Title</label>
              <input name="title" placeholder="e.g. I will design a professional logo"
                value={form.title} onChange={handleChange} required style={s.input} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Description</label>
              <textarea name="description" placeholder="Describe what you offer..."
                value={form.description} onChange={handleChange} required
                style={{ ...s.input, height: 120, resize: 'vertical' }} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Price (USD)</label>
              <input name="price" type="number" placeholder="0.00"
                value={form.price} onChange={handleChange} required style={s.input} />
            </div>
            {message && (
              <div style={{ ...s.msg, background: message.ok ? '#0f2e1a' : '#2e0f0f',
                color: message.ok ? '#4caf50' : '#ef5350' }}>{message.text}</div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={() => navigate('/')} style={s.btnBack}>← Cancel</button>
              <button type="submit" style={s.btn} disabled={loading}>
                {loading ? 'Posting...' : '🚀 Post Gig'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', justifyContent: 'center', padding: '40px 24px' },
  card: { background: T.bgCard, borderRadius: 16, padding: 32, width: '100%', maxWidth: 500,
    border: `1px solid ${T.border}`, boxShadow: T.shadow },
  title: { fontFamily: T.fontHeading, fontSize: 24, fontWeight: 800, color: T.white, marginBottom: 6 },
  subtitle: { color: T.textMuted, fontSize: 14, marginBottom: 24 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: T.textMuted, marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', border: `1.5px solid ${T.border}`,
    borderRadius: T.radiusSm, fontSize: 14, color: T.white, background: T.primary,
    boxSizing: 'border-box' },
  msg: { padding: '10px 14px', borderRadius: T.radiusSm, fontSize: 13, marginBottom: 16 },
  btn: { flex: 2, padding: '13px 0', borderRadius: T.radiusSm,
    background: `linear-gradient(135deg, ${T.accent}, ${T.primaryLight})`,
    color: T.white, border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  btnBack: { flex: 1, padding: '13px 0', borderRadius: T.radiusSm,
    background: T.primary, color: T.textMuted, border: `1.5px solid ${T.border}`,
    fontWeight: 600, fontSize: 14, cursor: 'pointer' },
};