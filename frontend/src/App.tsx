import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const Feed = () => <div>Live Developer Feed</div>;
const Profile = () => <div>User Profile</div>;
const CelebrationWall = () => <div>Celebration Wall</div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/celebration-wall" element={<CelebrationWall />} />
        <Route path="/" element={<Navigate to="/feed" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;