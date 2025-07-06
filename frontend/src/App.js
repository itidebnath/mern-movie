// frontend/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="loading-spinner"></div>
                <p className="text-white text-lg" style={{ marginLeft: '1rem' }}>Loading...</p>
            </div>
        );
    }

    return user ? children : null; // Render children if user is authenticated, otherwise navigate away
};

// Main App component
const AppContent = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        // Removed minHeight, display, flexDirection from here. Body handles it.
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {user && (
                <nav className="navbar-main">
                    <div className="navbar-content">
                        <h1 className="navbar-brand">Movie Site</h1>
                        <div className="navbar-nav">
                            <button
                                onClick={() => navigate('/')}
                                className="nav-link"
                            >
                                Home
                            </button>
                            {user.role === 'admin' && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="nav-link"
                                >
                                    Admin Dashboard
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
            )}

            {/* This div will now grow to push the footer down */}
            <div style={{ flexGrow: 1 }}>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <AuthForm
                                isLogin={true}
                                onAuthSuccess={() => navigate('/')}
                                onToggleMode={() => navigate('/signup')}
                            />
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <AuthForm
                                isLogin={false}
                                onAuthSuccess={() => navigate('/')}
                                onToggleMode={() => navigate('/login')}
                            />
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/category/:genre"
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>

            {user && <Footer />}
        </div>
    );
};

// Wrapper for AuthProvider and Router
const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

export default App;
