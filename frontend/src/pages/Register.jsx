import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { T } from './theme';

export default function Register() {
  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { ...form, role });
      setMessage({ text: res.data.message, ok: true });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Registration failed', ok: false });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font }}>
      <Navbar />
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.logoIcon}>G</div>
            <h2 style={s.title}>Create Account</h2>
            <p style={s.subtitle}>Join our freelance marketplace</p>
          </div>
          <p style={s.label}>I want to</p>
          <div style={s.toggleGroup}>
            {['buyer', 'seller'].map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                style={role === r ? s.toggleOn : s.toggleOff}>
                {r === 'buyer' ? '🛒 Buy Services' : '💼 Sell Services'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <div style={s.field}>
              <label style={s.label}>Username</label>
              <input name="username" placeholder="johndoe"
                value={form.username} onChange={handleChange} required style={s.input} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input name="email" type="email" placeholder="john@example.com"
                value={form.email} onChange={handleChange} required style={s.input} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input name="password" type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required style={s.input} />
            </div>
            {message && (
              <div style={{ ...s.msg, background: message.ok ? '#f0fff4' : '#fff0f0',
                color: message.ok ? '#2e7d32' : '#c62828' }}>{message.text}</div>
            )}
            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={s.footer}>
            Already have an account?{' '}
            <span style={s.footerLink} onClick={() => navigate('/login')}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', justifyContent: 'center', padding: '48px 16px' },
  card: { background: '#ffffff', borderRadius: 16, padding: 40, width: '100%', maxWidth: 440,
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' },
  cardHeader: { textAlign: 'center', marginBottom: 24 },
  logoIcon: { width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px',
    background: '#111111', color: '#ffffff', fontWeight: 900, fontSize: 24,
    display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: T.fontHeading, fontSize: 26, fontWeight: 900, color: '#111111', marginBottom: 6 },
  subtitle: { color: '#888888', fontSize: 14 },
  toggleGroup: { display: 'flex', gap: 10, marginBottom: 20 },
  toggleOn: { flex: 1, padding: '10px 0', borderRadius: '8px',
    background: '#111111', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  toggleOff: { flex: 1, padding: '10px 0', borderRadius: '8px',
    background: '#ffffff', color: '#888888', border: '1.5px solid #e0e0e0',
    fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#111111', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0',
    borderRadius: '8px', fontSize: 14, color: '#111111', background: '#fafafa', boxSizing: 'border-box' },
  msg: { padding: '10px 14px', borderRadius: '8px', fontSize: 13, fontWeight: 500, marginBottom: 16 },
  btn: { width: '100%', padding: '13px 0', borderRadius: '8px',
    background: '#111111', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888888' },
  footerLink: { color: '#111111', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' },
};