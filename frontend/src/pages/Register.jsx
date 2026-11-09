
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../styles/Auth.css';

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: ''
        }));

        setError('');
    };

    const validateForm = () => {
        const errors = {};

        if (formData.fullName.trim().length < 2) {
            errors.fullName = 'Enter your full name.';
        } else if (formData.fullName.trim().length > 80) {
            errors.fullName = 'Full name cannot exceed 80 characters.';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email address is required.';
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            errors.email = 'Enter a valid email address.';
        }

        if (formData.password.length < 8 || formData.password.length > 128) {
            errors.password = 'Password must contain between 8 and 128 characters.';
        } else if (!/[a-z]/.test(formData.password)) {
            errors.password = 'Password must contain a lowercase letter.';
        } else if (!/[A-Z]/.test(formData.password)) {
            errors.password = 'Password must contain an uppercase letter.';
        } else if (!/[0-9]/.test(formData.password)) {
            errors.password = 'Password must contain a number.';
        }

        if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await register({
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role
            });

            setSuccessMessage(
                'Your registration request has been processed. You can now attempt to sign in.'
            );

            setTimeout(() => {
                navigate('/login', {
                    state: {
                        registered: true,
                        email: formData.email.trim()
                    }
                });
            }, 1800);

        } catch (apiError) {
            const responseData = apiError.response?.data;

            if (responseData?.error?.details) {
                const errors = {};

                responseData.error.details.forEach((item) => {
                    if (item.field) {
                        errors[item.field] = item.message;
                    }
                });

                setFieldErrors(errors);
            }

            setError(
                responseData?.error?.message ||
                'Registration could not be completed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    //endregion

    return (
        <div className="auth-page">
            <div className="auth-container">

                <div className="auth-brand">
                    <Link to="/" className="auth-logo">
                        HustleHub<span>+</span>
                    </Link>

                    <p>Find your next opportunity.</p>
                </div>

                <div className="auth-card">

                    <div className="auth-heading">
                        <span className="auth-eyebrow">
                            GET STARTED
                        </span>

                        <h1>Create your account</h1>

                        <p>
                            Join HustleHub+ and connect with opportunities
                            and talented professionals.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-alert auth-alert-error" role="alert">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="auth-alert auth-alert-success" role="status">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="form-group">
                            <label htmlFor="fullName">
                                Full name
                            </label>

                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                autoComplete="name"
                                maxLength={80}
                                required
                                disabled={isLoading}
                                aria-invalid={Boolean(fieldErrors.fullName)}
                            />

                            {fieldErrors.fullName && (
                                <span className="field-error">
                                    {fieldErrors.fullName}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                Email address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                                disabled={isLoading}
                                aria-invalid={Boolean(fieldErrors.email)}
                            />

                            {fieldErrors.email && (
                                <span className="field-error">
                                    {fieldErrors.email}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Choose your account type</label>

                            <div className="role-selection">

                                <label
                                    className={`role-option ${formData.role === 'client' ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="client"
                                        checked={formData.role === 'client'}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />

                                    <span className="role-option-content">
                                        <strong>Client</strong>
                                        <small>
                                            Find and book freelance services.
                                        </small>
                                    </span>
                                </label>

                                <label
                                    className={`role-option ${formData.role === 'freelancer' ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="freelancer"
                                        checked={formData.role === 'freelancer'}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />

                                    <span className="role-option-content">
                                        <strong>Freelancer</strong>
                                        <small>
                                            Offer services and find clients.
                                        </small>
                                    </span>
                                </label>

                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    maxLength={128}
                                    required
                                    disabled={isLoading}
                                    aria-invalid={Boolean(fieldErrors.password)}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {fieldErrors.password && (
                                <span className="field-error">
                                    {fieldErrors.password}
                                </span>
                            )}

                            <small className="input-hint">
                                At least 8 characters, including uppercase,
                                lowercase and a number.
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Confirm password
                            </label>

                            <div className="password-input-wrapper">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                    disabled={isLoading}
                                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {fieldErrors.confirmPassword && (
                                <span className="field-error">
                                    {fieldErrors.confirmPassword}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>

                    </form>

                    <div className="auth-footer">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
                    </div>

                </div>

                <p className="auth-legal">
                    By creating an account, you agree to use HustleHub+
                    responsibly and securely.
                </p>

            </div>
        </div>
    );
}

export default Register;
