
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';


const AuthForm = ({ isLogin, onAuthSuccess, onToggleMode }) => {
    const { login, register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            result = await register(email, password);
        }

        if (result.success) {
            setMessage(isLogin ? 'Logged in successfully!' : 'Signed up successfully!');
            setMessageType('success');
            onAuthSuccess(); // This will navigate to home page
        } else {
            setMessage(result.message || 'An error occurred.');
            setMessageType('error');
        }
        setLoading(false);
    };

    const MessageBox = ({ msg, type, onClose }) => {
        if (!msg) return null;
        const bgColorClass = type === 'error' ? 'error' : 'success';
        return (
            <div className={`message-box ${bgColorClass}`}>
                <span>{msg}</span>
                <button onClick={onClose} className="message-box-close-btn">&times;</button>
            </div>
        );
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
            <form onSubmit={handleSubmit} className="form-card">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="form-input form-login"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-6">
                    <label className="form-label" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="form-input form-login"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex-container justify-between">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex-center">
                                <div className="loading-spinner-small"></div>
                                <span style={{ marginLeft: '0.5rem' }}>Processing...</span>
                            </div>
                        ) : (
                            isLogin ? 'Login' : 'Sign Up'
                        )}
                    </button>
                </div>
                <p className="text-center text-gray-400 text-sm mt-4">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                        type="button"
                        onClick={onToggleMode} // Call the new onToggleMode prop
                        className="text-purple-400 font-bold"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </form>
            <MessageBox msg={message} type={messageType} onClose={() => setMessage('')} />
        </div>
    );
};

export default AuthForm;
