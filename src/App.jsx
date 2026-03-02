import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import GuestMenu from './pages/GuestMenu';
import BaristaQueue from './pages/BaristaQueue';
import ManagerBoard from './pages/ManagerBoard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menu" element={
          // use <ProtectedRoute> to wrap each role page
          <ProtectedRoute role="Guest">
            <GuestMenu />
          </ProtectedRoute>
        } />
        <Route path="/barista" element={
          <ProtectedRoute role="Barista">
            <BaristaQueue />
          </ProtectedRoute>
        } />
        <Route path="/manager" element={
          <ProtectedRoute role="Manager">
            <ManagerBoard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}