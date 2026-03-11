import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import GuestMenu from './pages/GuestMenu';
import Logout from './pages/Logout';
import BaristaQueue from './pages/BaristaQueue';
import ManagerBoard from './pages/ManagerBoard';

// TODO: put Logout in GuestMenu instead of rendering it as a separate page

export default function App() {
  const [guestOrder, setGuestOrder] = useState({ id: 11, name: 'Select a drink to order', ingredients: ['none'] });
  const [orderSent, setOrderSent] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

function handleOrderComplete(orderResult) {
    setCompletedOrder(orderResult);
    localStorage.setItem('completedOrder', JSON.stringify(orderResult));
}

  function getOrder(order) {
    setGuestOrder(order);
  }

function submitOrder(order) {
    setOrderSent(true);
    getOrder(order);
    localStorage.setItem('guestOrder', JSON.stringify(order));
}

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menu" element={
          // Use <ProtectedRoute> to wrap each role page
          <ProtectedRoute role="Guest">
            { orderSent ?
              <Logout 
                  message={`Your ${guestOrder.name} order has been placed. Thank you!`}
                  redirectPath="/barista" 
              />
              :
              <GuestMenu guestOrder={guestOrder} getOrder={getOrder} submitOrder={submitOrder} />
            }
          </ProtectedRoute>}
        />
        <Route path="/barista" element={
          <ProtectedRoute role="Barista">
            <BaristaQueue guestOrder={guestOrder} onOrderComplete={handleOrderComplete} />          </ProtectedRoute>
        } />
        <Route path="/manager" element={
          <ProtectedRoute role="Manager">
              <ManagerBoard completedOrder={completedOrder} />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}