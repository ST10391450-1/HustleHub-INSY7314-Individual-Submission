
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../styles/Auth.css';

//region Functionality for Login Page

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    //region Functionality for Login Submission

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setIsSubmitting(true);

        try {
            await login({
                email: email.trim().toLowerCase(),
                password
            });

            navigate('/dashboard');

        } catch (err) {
            const message = err.response?.data?.error?.message
                || err.response?.data?.message
                || 'Unable to sign in. Please check your details and try again.';

            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    //endregion

    return (
        <div className="auth-page">
            <div className="auth-container">

                <Link to="/" className="auth-brand">
                    HustleHub<span>+</span>
                </Link>

                <div className="auth-card">

                    <div className="auth-heading">
                        <span className="section-overline">
                            WELCOME BACK
                        </span>

                        <h1>Sign in to your account</h1>

                        <p>
                            Access your HustleHub+ account and continue
                            where you left off.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-alert" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="email">
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>

                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register">
                                Create an account
                            </Link>
                        </p>
                    </div>

                </div>

                <p className="auth-legal">
                    By signing in, you agree to use HustleHub+
                    responsibly and securely.
                </p>

            </div>
        </div>
    );
}

//endregion

export default Login;
