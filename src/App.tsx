import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import HomePage from './pages/HomePage';
import MedicalHistoryPage from './pages/MedicalHistoryPage';
import MedicalChartsPage from './pages/MedicalChartsPage';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <div className="font-sans antialiased">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-account" element={<CreateAccountPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/history" element={<MedicalHistoryPage />} />
                <Route path="/charts" element={<MedicalChartsPage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;