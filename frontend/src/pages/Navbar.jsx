import { useNavigate } from 'react-router-dom';
import { T } from './theme';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <nav style={s.nav}>
      <div style={s.logo} onClick={() => navigate('/')}>
        <div style={s.logoIcon}>G</div>
        <span style={s.logoText}>GigMarket</span>
      </div>
      <div style={s.links}>
        <span style={s.link} onClick={() => navigate('/')}>Browse Gigs</span>
        {token && <span style={s.link} onClick={() => navigate('/orders')}>My Orders</span>}
        {token && <span style={s.link} onClick={() => navigate('/messages')}>Messages</span>}
        {token && role === 'seller' && (
          <button style={s.btnOutline} onClick={() => navigate('/create-gig')}>+ Post a Gig</button>
        )}
        {token
          ? <button style={s.btnPrimary} onClick={logout}>Logout</button>
          : <>
              <button style={s.btnOutline} onClick={() => navigate('/login')}>Sign In</button>
              <button style={s.btnPrimary} onClick={() => navigate('/register')}>Join</button>
            </>
        }
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 48px', height: 64, background: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: '#111111', color: '#ffffff',
    fontWeight: 900, fontSize: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: T.fontHeading,
  },
  logoText: {
    fontFamily: T.fontHeading, fontWeight: 900,
    fontSize: 20, color: '#111111',
  },
  links: { display: 'flex', alignItems: 'center', gap: 28 },
  link: {
    fontSize: 14, fontWeight: 500, color: '#555555',
    cursor: 'pointer', textDecoration: 'none',
  },
  btnOutline: {
    padding: '7px 18px', borderRadius: T.radiusSm,
    border: '1.5px solid #111111', background: 'transparent',
    color: '#111111', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },
  btnPrimary: {
    padding: '7px 20px', borderRadius: T.radiusSm,
    background: '#111111', border: 'none',
    color: '#ffffff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },
};