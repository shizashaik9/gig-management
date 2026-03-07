import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { T } from './theme';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const params = new URLSearchParams(window.location.search);
  const gig_id = params.get('gig_id');
  const order_id = params.get('order_id');

  useEffect(() => {
    if (gig_id)
      axios.get(`http://localhost:5000/api/reviews/${gig_id}`)
        .then(res => setReviews(res.data)).catch(console.error);
  }, [gig_id]);

  const submitReview = async () => {
    if (!order_id) return alert('Go to My Orders to leave a review.');
    try {
      const res = await axios.post('http://localhost:5000/api/reviews',
        { order_id, gig_id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ text: res.data.message, ok: true });
      setComment('');
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed', ok: false });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font }}>
      <Navbar />
      <div style={s.page}>
        <div style={{ maxWidth: 600, width: '100%' }}>
          <h2 style={s.title}>Reviews</h2>
          <p style={s.subtitle}>See what others are saying</p>
          {order_id && (
            <div style={s.card}>
              <h3 style={{ fontFamily: T.fontHeading, fontSize: 16, fontWeight: 700,
                color: T.white, marginBottom: 16 }}>Leave a Review</h3>
              <div style={s.field}>
                <label style={s.label}>Rating</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setRating(n)}
                      style={{ fontSize: 28, background: 'none', border: 'none',
                        cursor: 'pointer', color: n <= rating ? '#f39c12' : T.border }}>★</button>
                  ))}
                </div>
              </div>
              <div style={s.field}>
                <label style={s.label}>Comment</label>
                <textarea placeholder="Share your experience..."
                  value={comment} onChange={(e) => setComment(e.target.value)}
                  style={{ ...s.input, height: 90, resize: 'vertical' }} />
              </div>
              {message && (
                <div style={{ ...s.msg, background: message.ok ? '#0f2e1a' : '#2e0f0f',
                  color: message.ok ? '#4caf50' : '#ef5350' }}>{message.text}</div>
              )}
              <button onClick={submitReview} style={s.btn}>Submit Review</button>
            </div>
          )}
          <h3 style={{ fontFamily: T.fontHeading, fontSize: 16, fontWeight: 700,
            color: T.white, margin: '24px 0 16px' }}>All Reviews ({reviews.length})</h3>
          {reviews.length === 0
            ? <p style={{ color: T.textMuted }}>No reviews yet.</p>
            : reviews.map(r => (
              <div key={r.id} style={s.reviewCard}>
                <div style={{ color: '#f39c12', fontSize: 18, marginBottom: 6 }}>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
                <p style={{ color: T.text, fontSize: 14, lineHeight: 1.6 }}>{r.comment || 'No comment.'}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', justifyContent: 'center', padding: '40px 24px' },
  title: { fontFamily: T.fontHeading, fontSize: 26, fontWeight: 800, color: T.white, marginBottom: 6 },
  subtitle: { color: T.textMuted, fontSize: 14, marginBottom: 24 },
  card: { background: T.bgCard, borderRadius: 16, padding: 24,
    border: `1px solid ${T.border}`, boxShadow: T.shadow, marginBottom: 8 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: T.textMuted, marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', border: `1.5px solid ${T.border}`,
    borderRadius: T.radiusSm, fontSize: 14, color: T.white,
    background: T.primary, boxSizing: 'border-box' },
  msg: { padding: '10px 14px', borderRadius: T.radiusSm, fontSize: 13, marginBottom: 16 },
  btn: { width: '100%', padding: '12px 0', borderRadius: T.radiusSm,
    background: `linear-gradient(135deg, ${T.accent}, ${T.primaryLight})`,
    color: T.white, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  reviewCard: { background: T.bgCard, borderRadius: 12, padding: 20,
    border: `1px solid ${T.border}`, marginBottom: 12, boxShadow: T.shadow },
};