import { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { T } from './theme';

export default function Messages() {
  const [receiverUsername, setReceiverUsername] = useState('');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchMessages = async () => {
    if (!receiverUsername) return;
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${receiverUsername}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'User not found');
    }
  };

  const sendMessage = async () => {
    if (!receiverUsername || !content) return;
    try {
      await axios.post('http://localhost:5000/api/messages',
        { receiver_username: receiverUsername, content },
        { headers: { Authorization: `Bearer ${token}` } });
      setContent('');
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: T.font }}>
      <Navbar />
      <div style={s.page}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          <h2 style={s.title}>Messages</h2>
          <p style={s.subtitle}>Chat with buyers and sellers</p>
          <div style={s.card}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <input placeholder="Enter username to chat with..."
                value={receiverUsername} onChange={(e) => setReceiverUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMessages()}
                style={{ ...s.input, flex: 1 }} />
              <button onClick={fetchMessages} style={s.btn}>Load</button>
            </div>
            {error && <p style={{ color: 'red', fontSize: 13, marginBottom: 10 }}>{error}</p>}
            <div style={s.chatBox}>
              {messages.length === 0
                ? <p style={{ color: '#aaa', textAlign: 'center', padding: 20 }}>
                    No messages yet. Enter a username and start chatting!
                  </p>
                : messages.map(msg => (
                  <div key={msg.id} style={s.bubble}>
                    <span style={s.sender}>
                      {msg.sender_id === msg.receiver_id ? 'You' : `User ${msg.sender_id}`}
                    </span>
                    <p style={s.msgText}>{msg.content}</p>
                    <span style={s.time}>{new Date(msg.created_at).toLocaleTimeString()}</span>
                  </div>
                ))
              }
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <input placeholder="Type a message..."
                value={content} onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                style={{ ...s.input, flex: 1 }} />
              <button onClick={sendMessage} style={s.btn}>Send ➤</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', justifyContent: 'center', padding: '40px 24px' },
  title: { fontFamily: T.fontHeading, fontSize: 26, fontWeight: 900, color: '#111111', marginBottom: 6 },
  subtitle: { color: '#888888', fontSize: 14, marginBottom: 24 },
  card: { background: '#ffffff', borderRadius: 16, padding: 24,
    border: '1px solid #e0e0e0', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' },
  input: { padding: '11px 14px', border: '1.5px solid #e0e0e0',
    borderRadius: '8px', fontSize: 14, color: '#111111',
    background: '#fafafa', boxSizing: 'border-box' },
  btn: { padding: '11px 20px', borderRadius: '8px',
    background: '#111111', color: '#ffffff',
    border: 'none', fontWeight: 600, cursor: 'pointer' },
  chatBox: { border: '1px solid #e0e0e0', borderRadius: '8px',
    padding: 16, minHeight: 200, maxHeight: 320, overflowY: 'auto', background: '#fafafa' },
  bubble: { marginBottom: 14 },
  sender: { fontSize: 11, fontWeight: 700, color: '#111111', display: 'block', marginBottom: 2 },
  msgText: { fontSize: 14, color: '#111111', background: '#ffffff',
    padding: '8px 12px', borderRadius: 8, display: 'inline-block',
    border: '1px solid #e0e0e0' },
  time: { fontSize: 10, color: '#aaa', display: 'block', marginTop: 2 },
};