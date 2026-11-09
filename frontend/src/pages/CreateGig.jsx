import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import '../styles/CreateGig.css';

//region Create Gig Page
function CreateGig() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        deliveryDays: '7'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    //region Handle Form Changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));
    };
    //endregion

    //region Submit New Gig
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError('');

            await api.post('/gigs', {
                ...formData,
                price: Number(formData.price),
                deliveryDays: Number(formData.deliveryDays)
            });

            navigate('/gigs');
        } catch (requestError) {
            const validationErrors =
                requestError.response?.data?.errors;

            if (Array.isArray(validationErrors)) {
                setError(
                    validationErrors.map(item => item.msg).join(' ')
                );
            } else {
                setError(
                    requestError.response?.data?.error?.message ||
                    'Unable to create your gig. Please try again.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    //endregion

    if (user?.role !== 'freelancer') {
        return (
            <main className="create-gig-page">
                <div className="create-gig-container">
                    <h1>Freelancer access required</h1>
                    <p>Only freelancer accounts can create gigs.</p>
                    <Link to="/dashboard" className="create-gig-back">
                        Return to dashboard
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <div className="create-gig-page">
            <header className="create-gig-navbar">
                <Link to="/" className="create-gig-brand">
                    HustleHub<span>+</span>
                </Link>

                <nav>
                    <Link to="/gigs">Explore gigs</Link>
                    <Link to="/dashboard">Dashboard</Link>
                </nav>
            </header>

            <main className="create-gig-container">
                <Link to="/gigs" className="create-gig-back">
                    Back to services
                </Link>

                <section className="create-gig-heading">
                    <span>GROW YOUR FREELANCE BUSINESS</span>
                    <h1>Create a new gig</h1>
                    <p>
                        Describe the service you offer and let clients
                        discover what you can do.
                    </p>
                </section>

                <form className="create-gig-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="create-gig-error" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="create-gig-field">
                        <label htmlFor="title">Gig title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. I will build a modern business website"
                            minLength={5}
                            maxLength={100}
                            required
                        />
                        <small>Between 5 and 100 characters.</small>
                    </div>

                    <div className="create-gig-field">
                        <label htmlFor="description">Service description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Explain what your service includes and what clients can expect..."
                            minLength={20}
                            maxLength={2000}
                            rows={6}
                            required
                        />
                        <small>Between 20 and 2,000 characters.</small>
                    </div>

                    <div className="create-gig-field">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="Writing">Writing</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Video Editing">Video Editing</option>
                            <option value="Business">Business</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="create-gig-form-row">
                        <div className="create-gig-field">
                            <label htmlFor="price">Price (ZAR)</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="1500"
                                min="1"
                                max="1000000"
                                step="0.01"
                                required
                            />
                            <small>Minimum R1.00.</small>
                        </div>

                        <div className="create-gig-field">
                            <label htmlFor="deliveryDays">Delivery time</label>
                            <input
                                id="deliveryDays"
                                name="deliveryDays"
                                type="number"
                                value={formData.deliveryDays}
                                onChange={handleChange}
                                min="1"
                                max="365"
                                required
                            />
                            <small>Between 1 and 365 days.</small>
                        </div>
                    </div>

                    <div className="create-gig-actions">
                        <Link to="/gigs" className="create-gig-cancel">
                            Cancel
                        </Link>

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating gig...' : 'Publish gig'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
//endregion

export default CreateGig;