import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import GigList from './pages/GigList';
import CreateGig from './pages/CreateGig';
import Orders from './pages/Orders';
import Messages from './pages/Messages';
import Reviews from './pages/Reviews';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<GigList />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/create-gig" element={<CreateGig />} />
        <Route path="/orders"     element={<Orders />} />
        <Route path="/messages"   element={<Messages />} />
        <Route path="/reviews"    element={<Reviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;