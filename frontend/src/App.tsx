import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; 
import Welcome from './pages/Welcome'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import CelebrationWall from './pages/CelebrationWall';
import People from './pages/People';
import Settings from './pages/Settings';
import Messages from './pages/Messages';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Welcome />} /> {/* <-- MAP ROOT TO WELCOME PAGE */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes - Wrapped in the Layout Shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/celebration-wall" element={<CelebrationWall />} />
          <Route path="/people" element={<People />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Catch-all 404 - Kicks invalid URLs back to the root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;