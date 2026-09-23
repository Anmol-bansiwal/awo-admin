import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { MainLayout } from './components/MainLayout';
import { Login } from './pages/Login';
import { VerifyOtp } from './pages/VerifyOtp';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './features/customers/pages/Customers';
import { CustomerDetails } from './features/customers/pages/CustomerDetails';
import { Providers } from './features/providers/pages/Providers';
import { ProviderDetails } from './features/providers/pages/ProviderDetails';
import { ServiceCategories } from './features/notifications-content/pages/ServiceCategories';
import { Bookings } from './features/bookings/pages/Bookings';
import { BookingDetails } from './features/bookings/pages/BookingDetails';
import { Transactions } from './features/finance/pages/Transactions';
import { Escrow } from './features/finance/pages/Escrow';
import { Payouts } from './features/finance/pages/Payouts';
import { Refunds } from './features/finance/pages/Refunds';
import { Commission } from './features/finance/pages/Commission';
import { RevenueReports } from './features/finance/pages/RevenueReports';
import { Complaints } from './features/complaints/pages/Complaints';
import { Disputes } from './features/complaints/pages/Disputes';
import { RefundRequests } from './features/complaints/pages/RefundRequests';
import { Escalations } from './features/complaints/pages/Escalations';
import { Announcements } from './features/notifications-content/pages/Announcements';
import { NotificationSettings } from './features/notifications-content/pages/NotificationSettings';
import { PoliciesContent } from './features/notifications-content/pages/PoliciesContent';
import { Analytics } from './features/analytics/pages/Analytics';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
          <Route path="/categories" element={<ServiceCategories />} />

          {/* Phase 8: Financial Management Routes */}
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/escrow" element={<Escrow />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/revenue-reports" element={<RevenueReports />} />

          {/* Phase 9: Complaint & Dispute Resolution Routes */}
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/disputes" element={<Disputes />} />
          <Route path="/refund-requests" element={<RefundRequests />} />
          <Route path="/escalations" element={<Escalations />} />

          {/* Phase 11: Notifications & Content Management Routes */}
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/notification-settings" element={<NotificationSettings />} />
          <Route path="/service-categories" element={<ServiceCategories />} />
          <Route path="/policies-content" element={<PoliciesContent />} />

          {/* Phase 12: Analytics & Reporting Routes */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics/:tab" element={<Analytics />} />

          {/* Route Aliases */}
          <Route path="/notifications" element={<Navigate to="/notification-settings" replace />} />
          <Route path="/notifications-content" element={<Navigate to="/announcements" replace />} />
          <Route path="/policies" element={<Navigate to="/policies-content" replace />} />
        </Route>

        {/* Root & Catch-all fallback route */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? '/customers' : '/login'} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
