import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { T } from './theme';

export default function GigList() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const fetchGigs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/gigs?search=${search}`);
      setGigs(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchGigs(); }, []);

  const placeOrder = async (gig) => {
    if (!token) { navigate('/login'); return; }
    try {
      await axios.post('http://localhost:5000/api/orders', { gig_id: gig.id },
        { headers: { Authorization: `Bearer ${token}` } });
      alert('Order placed successfully!');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: T.font }}>
      <Navbar />

      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Find the perfect freelance service</h1>
        <p style={s.heroSub}>Browse gigs from talented freelancers</p>
        <div style={s.searchBox}>
          <span style={{ color: '#aaa' }}>🔍</span>
          <input placeholder="Search for any service..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchGigs()}
            style={s.searchInput} />
          <button onClick={fetchGigs} style={s.searchBtn}>Search</button>
        </div>
      </div>

      {/* Gigs */}
      <div style={s.container}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>{search ? `Results for "${search}"` : 'All Gigs'}</h2>
          <span style={s.count}>{gigs.length} gig{gigs.length !== 1 ? 's' : ''} found</span>
        </div>
        {gigs.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔎</div>
            <p style={{ color: T.textMuted }}>No gigs found.</p>
          </div>
        ) : (
          <div style={s.grid}>
            {gigs.map(gig => (
              <div key={gig.id} style={s.card}>
                <div style={s.cardBanner}><span style={{ fontSize: 36 }}>💼</span></div>
                <div style={s.cardBody}>
                  <h3 style={s.cardTitle}>{gig.title}</h3>
                  <p style={s.cardDesc}>{gig.description}</p>
                  <div style={s.cardFooter}>
                    <span style={s.price}>${gig.price}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => navigate(`/reviews?gig_id=${gig.id}`)} style={s.btnSec}>
                        ⭐ Reviews
                      </button>
                      {role === 'buyer' && (
                        <button onClick={() => placeOrder(gig)} style={s.btnPri}>Order Now</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  hero: {
    background: '#f9f9f9', padding: '64px 24px',
    textAlign: 'center', borderBottom: '1px solid #e0e0e0',
  },
  heroTitle: {
    fontFamily: T.fontHeading, fontSize: 40, fontWeight: 900,
    color: '#111111', marginBottom: 12,
  },
  heroSub: { color: '#888888', fontSize: 16, marginBottom: 32 },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    maxWidth: 560, margin: '0 auto',
    background: '#ffffff', borderRadius: 12,
    padding: '6px 6px 6px 16px',
    border: '1.5px solid #e0e0e0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  searchInput: {
    flex: 1, border: 'none', background: 'transparent',
    fontSize: 15, color: '#111111', outline: 'none', padding: '8px 0',
  },
  searchBtn: {
    padding: '10px 24px', borderRadius: 8,
    background: '#111111', color: '#ffffff',
    border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
  },
  container: { maxWidth: 1100, margin: '0 auto', padding: '40px 24px' },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: T.fontHeading, fontSize: 22,
    fontWeight: 900, color: '#111111',
  },
  count: {
    fontSize: 13, color: '#888888',
    background: '#f5f5f5', padding: '4px 12px',
    borderRadius: 20, border: '1px solid #e0e0e0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24,
  },
  card: {
    background: '#ffffff', borderRadius: 12, overflow: 'hidden',
    border: '1px solid #e0e0e0',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  },
  cardBanner: {
    height: 100, background: '#f5f5f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { padding: 20 },
  cardTitle: {
    fontFamily: T.fontHeading, fontSize: 16,
    fontWeight: 700, color: '#111111', marginBottom: 8, lineHeight: 1.4,
  },
  cardDesc: { fontSize: 13, color: '#888888', marginBottom: 16, lineHeight: 1.6 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: {
    fontFamily: T.fontHeading, fontSize: 20,
    fontWeight: 900, color: '#111111',
  },
  btnPri: {
    padding: '7px 14px', borderRadius: 8,
    background: '#111111', color: '#ffffff',
    border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer',
  },
  btnSec: {
    padding: '7px 14px', borderRadius: 8,
    background: '#ffffff', color: '#111111',
    border: '1.5px solid #e0e0e0',
    fontWeight: 600, fontSize: 12, cursor: 'pointer',
  },
  empty: { textAlign: 'center', padding: '80px 0' },
};