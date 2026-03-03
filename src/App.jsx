import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import GuestMenu from './pages/GuestMenu';
import Logout from './pages/Logout';
import BaristaQueue from './pages/BaristaQueue';
import ManagerBoard from './pages/ManagerBoard';

export default function App() {
  const [guestOrder, setGuestOrder] = useState({ id: 11, name: 'Select a drink to order', ingredients: ['none'] });
  const [orderSent, setOrderSent] = useState(false);

  function getOrder(order) {
    setGuestOrder(order);
  }

  function submitOrder() {
    setOrderSent(true);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menu" element={
          // use <ProtectedRoute> to wrap each role page
          <ProtectedRoute role="Guest">
            { orderSent ?
              <Logout guestOrder={guestOrder}/>
              :
              <GuestMenu getOrder={getOrder} guestOrder={guestOrder} submitOrder={submitOrder} />
            }
          </ProtectedRoute>}
        />
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