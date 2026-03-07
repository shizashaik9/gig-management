import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { T } from './theme';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/orders',
      { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data)).catch(console.error);
  }, []);

  const statusColor = { pending: '#f39c12', in_progress: T.accent, completed: '#4caf50' };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font }}>
      <Navbar />
      <div style={s.page}>
        <div style={{ maxWidth: 700, width: '100%' }}>
          <h2 style={s.title}>My Orders</h2>
          <p style={s.subtitle}>Track all your purchased services</p>
          {orders.length === 0 ? (
            <div style={s.empty}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p style={{ color: T.textMuted }}>No orders yet.</p>
              <button onClick={() => navigate('/')} style={{ ...s.btn, marginTop: 16 }}>Browse Gigs</button>
            </div>
          ) : orders.map(order => (
            <div key={order.id} style={s.card}>
              <div style={s.left}>
                <div style={s.icon}>💼</div>
                <div>
                  <h3 style={s.cardTitle}>{order.title}</h3>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: (statusColor[order.status] || T.accent) + '22',
                    color: statusColor[order.status] || T.accent }}>● {order.status}</span>
                </div>
              </div>
              <div style={s.right}>
                <span style={s.price}>${order.price}</span>
                <button onClick={() => navigate(`/reviews?gig_id=${order.gig_id}&order_id=${order.id}`)}
                  style={s.btnReview}>⭐ Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', justifyContent: 'center', padding: '40px 24px' },
  title: { fontFamily: T.fontHeading, fontSize: 26, fontWeight: 900, color: '#111111', marginBottom: 6 },
  subtitle: { color: '#888888', fontSize: 14, marginBottom: 24 },
  card: {
    background: '#ffffff', borderRadius: 12, padding: '16px 20px',
    border: '1px solid #e0e0e0', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  left: { display: 'flex', alignItems: 'center', gap: 14 },
  icon: { fontSize: 28, background: '#f5f5f5', borderRadius: 10, padding: 8 },
  cardTitle: {
    fontFamily: T.fontHeading, fontSize: 15, fontWeight: 700,
    color: '#111111', marginBottom: 4,
  },
  right: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 },
  price: { fontFamily: T.fontHeading, fontSize: 18, fontWeight: 900, color: '#111111' },
  btn: {
    padding: '10px 24px', borderRadius: '8px',
    background: '#111111', color: '#ffffff',
    border: 'none', fontWeight: 600, cursor: 'pointer',
  },
  btnReview: {
    padding: '6px 14px', borderRadius: '8px', fontSize: 12, fontWeight: 600,
    background: '#111111', color: '#ffffff',
    border: 'none', cursor: 'pointer',
  },
  empty: { textAlign: 'center', padding: 40 },
};