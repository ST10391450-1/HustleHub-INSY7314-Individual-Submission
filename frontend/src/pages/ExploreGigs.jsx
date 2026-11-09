
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/ExploreGigs.css';

function ExploreGigs() {
    const { user } = useAuth();
    const currentUserId = user?.id || user?.userId;

    const [gigs, setGigs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All categories');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [bookingGigId, setBookingGigId] = useState(null);
    const [bookingMessage, setBookingMessage] = useState('');
    const [bookingError, setBookingError] = useState('');

    const [editingGigId, setEditingGigId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editError, setEditError] = useState('');
    const [editMessage, setEditMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    //region Retrieve Available Gigs
    const fetchGigs = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await api.get('/gigs');
            setGigs(response.data.data || []);
        } catch (requestError) {
            setError(
                requestError.response?.data?.error?.message ||
                'Unable to retrieve gigs. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };
    //endregion

    useEffect(() => {
        fetchGigs();
    }, []);

    //region Filter Gig Categories
    const categories = useMemo(() => {
        return [
            'All categories',
            ...new Set(gigs.map(gig => gig.category))
        ];
    }, [gigs]);
    //endregion

    //region Filter Available Gigs
    const filteredGigs = useMemo(() => {
        return gigs.filter(gig => {
            const searchValue = searchTerm.toLowerCase();

            const matchesSearch =
                gig.title.toLowerCase().includes(searchValue) ||
                gig.description.toLowerCase().includes(searchValue) ||
                gig.category.toLowerCase().includes(searchValue);

            const matchesCategory =
                selectedCategory === 'All categories' ||
                gig.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [gigs, searchTerm, selectedCategory]);

    const myGigs = filteredGigs.filter(
        gig =>
            user?.role === 'freelancer' &&
            gig.freelancerId === currentUserId
    );

    const otherGigs = filteredGigs.filter(
        gig =>
            user?.role !== 'freelancer' ||
            gig.freelancerId !== currentUserId
    );
    //endregion

    //region Format Currency
    const formatPrice = price => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 2
        }).format(price);
    };
    //endregion

    //region Handle Booking
    const handleBooking = async gig => {
        const confirmed = window.confirm(
            `Book "${gig.title}" for ${formatPrice(gig.price)}?`
        );

        if (!confirmed) return;

        try {
            setBookingGigId(gig.id);
            setBookingMessage('');
            setBookingError('');

            const response = await api.post('/bookings', {
                gigId: gig.id
            });

            setBookingMessage(
                response.data.message ||
                'Your booking was created successfully.'
            );
        } catch (requestError) {
            setBookingError(
                requestError.response?.data?.error?.message ||
                'Unable to create your booking. Please try again.'
            );
        } finally {
            setBookingGigId(null);
        }
    };
    //endregion

    //region Open Gig Editor
    const handleEditClick = gig => {
        setEditingGigId(gig.id);

        setEditForm({
            title: gig.title,
            description: gig.description,
            category: gig.category,
            price: gig.price,
            deliveryDays: gig.deliveryDays
        });

        setEditError('');
        setEditMessage('');
    };
    //endregion

    //region Update Edit Form
    const handleEditChange = event => {
        const { name, value } = event.target;

        setEditForm(previous => ({
            ...previous,
            [name]: value
        }));
    };
    //endregion

    //region Save Gig Changes
    const handleSaveEdit = async (event, gig) => {
        event.preventDefault();

        if (gig.freelancerId !== currentUserId) {
            setEditError('You are not authorised to edit this gig.');
            return;
        }

        try {
            setIsSaving(true);
            setEditError('');
            setEditMessage('');

            const updatedGig = {
                ...editForm,
                price: Number(editForm.price),
                deliveryDays: Number(editForm.deliveryDays)
            };

            const response = await api.put(
                `/gigs/${gig.id}`,
                updatedGig
            );

            const savedGig = response.data.data;

            setGigs(previous =>
                previous.map(existingGig =>
                    existingGig.id === gig.id
                        ? { ...existingGig, ...savedGig, ...updatedGig }
                        : existingGig
                )
            );

            setEditingGigId(null);
            setEditMessage('Your gig was updated successfully.');
        } catch (requestError) {
            setEditError(
                requestError.response?.data?.error?.message ||
                'Unable to update your gig. Please check your information.'
            );
        } finally {
            setIsSaving(false);
        }
    };
    //endregion

    //region Cancel Gig Editing
    const handleCancelEdit = () => {
        setEditingGigId(null);
        setEditForm({});
        setEditError('');
    };
    //endregion

    //region Render Gig Cards
    const renderGigCards = gigList => {
        return gigList.map(gig => {
            const isOwner =
                user?.role === 'freelancer' &&
                gig.freelancerId === currentUserId;

            const isEditing = editingGigId === gig.id;

            return (
                <article
                    className="explore-gig-card"
                    key={gig.id}
                >
                    <div className="explore-gig-banner">
                        <span>{gig.category.toUpperCase()}</span>
                        <div className="explore-gig-banner-shape"></div>
                    </div>

                    <div className="explore-gig-details">

                        <div className="gig-ownership-label">
                            {isOwner ? 'Your listing' : 'Other freelancer'}
                        </div>

                        <span className="explore-gig-category">
                            {gig.category}
                        </span>

                        <h3>{gig.title}</h3>

                        <p className="explore-gig-description">
                            {gig.description}
                        </p>

                        <div className="explore-gig-freelancer">
                            <span className="explore-gig-avatar">HH</span>
                            <span>HustleHub+ Freelancer</span>
                        </div>

                        <div className="explore-gig-footer">
                            <div className="explore-gig-delivery">
                                <span>Delivery</span>
                                <strong>{gig.deliveryDays} days</strong>
                            </div>

                            <div className="explore-gig-price">
                                <span>Starting at</span>
                                <strong>{formatPrice(gig.price)}</strong>
                            </div>
                        </div>

                        {isOwner && !isEditing && (
                            <button
                                type="button"
                                className="edit-gig-button"
                                onClick={() => handleEditClick(gig)}
                            >
                                Edit your gig
                            </button>
                        )}

                        {isEditing && (
                            <form
                                className="gig-edit-form"
                                onSubmit={event => handleSaveEdit(event, gig)}
                            >
                                <h4>Edit your gig</h4>

                                <label>
                                    Gig title
                                    <input
                                        type="text"
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleEditChange}
                                        minLength="5"
                                        maxLength="100"
                                        required
                                    />
                                </label>

                                <label>
                                    Description
                                    <textarea
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        minLength="20"
                                        maxLength="2000"
                                        rows="4"
                                        required
                                    />
                                </label>

                                <label>
                                    Category
                                    <input
                                        type="text"
                                        name="category"
                                        value={editForm.category}
                                        onChange={handleEditChange}
                                        maxLength="50"
                                        required
                                    />
                                </label>

                                <label>
                                    Price (ZAR)
                                    <input
                                        type="number"
                                        name="price"
                                        value={editForm.price}
                                        onChange={handleEditChange}
                                        min="1"
                                        max="1000000"
                                        required
                                    />
                                </label>

                                <label>
                                    Delivery days
                                    <input
                                        type="number"
                                        name="deliveryDays"
                                        value={editForm.deliveryDays}
                                        onChange={handleEditChange}
                                        min="1"
                                        max="365"
                                        required
                                    />
                                </label>

                                {editError && (
                                    <div className="explore-error">
                                        {editError}
                                    </div>
                                )}

                                <div className="gig-edit-actions">
                                    <button
                                        type="submit"
                                        className="save-gig-button"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save changes'}
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-gig-button"
                                        onClick={handleCancelEdit}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {user?.role === 'client' && (
                            <button
                                type="button"
                                className="create-gig-button"
                                onClick={() => handleBooking(gig)}
                                disabled={bookingGigId !== null}
                            >
                                {bookingGigId === gig.id
                                    ? 'Creating booking...'
                                    : 'Book this service'}
                            </button>
                        )}

                        {!user && (
                            <Link
                                to="/login"
                                className="create-gig-button"
                            >
                                Log in to book
                            </Link>
                        )}
                    </div>
                </article>
            );
        });
    };
    //endregion

    return (
        <div className="explore-page">

            <header className="explore-navbar">
                <Link to="/" className="explore-brand">
                    HustleHub<span>+</span>
                </Link>

                <nav className="explore-nav-links">
                    <Link to="/gigs" className="active">
                        Explore gigs
                    </Link>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>
                </nav>

                <div className="explore-nav-actions">
                    {user ? (
                        <span className="explore-user-name">
                            {user.fullName}
                        </span>
                    ) : (
                        <>
                            <Link to="/login" className="explore-login">
                                Log in
                            </Link>

                            <Link
                                to="/register"
                                className="explore-join-button"
                            >
                                Join HustleHub+
                            </Link>
                        </>
                    )}
                </div>
            </header>

            <main className="explore-content">

                <section className="explore-heading">
                    <span className="section-overline">
                        THE HUSTLEHUB+ MARKETPLACE
                    </span>

                    <h1>
                        Discover services.
                        <span> Find your next opportunity.</span>
                    </h1>

                    <p>
                        Explore services offered by independent professionals
                        and find the right skills for your next project.
                    </p>
                </section>

                <section className="explore-search-section">

                    <div className="explore-search">
                        <input
                            type="search"
                            placeholder="Search services, skills or keywords..."
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                            aria-label="Search gigs"
                        />
                    </div>

                    <div className="explore-filter">
                        <select
                            value={selectedCategory}
                            onChange={event => setSelectedCategory(event.target.value)}
                            aria-label="Filter by category"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                </section>

                <section className="explore-results">

                    <div className="explore-results-heading">
                        <div>
                            <h2>Available services</h2>
                            <p>
                                {isLoading
                                    ? 'Loading available services...'
                                    : `${filteredGigs.length} services found`
                                }
                            </p>
                        </div>

                        {user?.role === 'freelancer' && (
                            <Link
                                to="/gigs/create"
                                className="create-gig-button"
                            >
                                Create a gig
                            </Link>
                        )}
                    </div>

                    {bookingMessage && (
                        <div className="explore-message">
                            <p>{bookingMessage}</p>
                        </div>
                    )}

                    {bookingError && (
                        <div className="explore-error">
                            <p>{bookingError}</p>
                        </div>
                    )}

                    {editMessage && (
                        <div className="explore-message">
                            <p>{editMessage}</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="explore-message">
                            <p>Loading available gigs...</p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="explore-error">
                            <p>{error}</p>
                            <button type="button" onClick={fetchGigs}>
                                Try again
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && filteredGigs.length === 0 && (
                        <div className="explore-message">
                            <h3>No gigs found</h3>
                            <p>
                                Try another search term or select a different
                                category.
                            </p>
                        </div>
                    )}

                    {!isLoading && !error && filteredGigs.length > 0 && (
                        <>
                            {user?.role === 'freelancer' ? (
                                <>
                                    <section className="gig-listing-section">
                                        <div className="gig-listing-heading">
                                            <div>
                                                <h2>My Listings</h2>
                                                <p>
                                                    Manage the services you have created.
                                                </p>
                                            </div>
                                            <span>{myGigs.length} listings</span>
                                        </div>

                                        {myGigs.length > 0 ? (
                                            <div className="explore-gig-grid">
                                                {renderGigCards(myGigs)}
                                            </div>
                                        ) : (
                                            <div className="explore-message">
                                                <h3>You haven't created any gigs yet</h3>
                                                <p>
                                                    Create your first listing to offer services.
                                                </p>
                                            </div>
                                        )}
                                    </section>

                                    <section className="gig-listing-section">
                                        <div className="gig-listing-heading">
                                            <div>
                                                <h2>Other Freelancers' Listings</h2>
                                                <p>
                                                    Explore services offered by other freelancers.
                                                </p>
                                            </div>
                                            <span>{otherGigs.length} listings</span>
                                        </div>

                                        {otherGigs.length > 0 ? (
                                            <div className="explore-gig-grid">
                                                {renderGigCards(otherGigs)}
                                            </div>
                                        ) : (
                                            <div className="explore-message">
                                                No other freelancer listings are available.
                                            </div>
                                        )}
                                    </section>
                                </>
                            ) : (
                                <div className="explore-gig-grid">
                                    {renderGigCards(filteredGigs)}
                                </div>
                            )}
                        </>
                    )}

                </section>

            </main>

            <footer className="explore-footer">
                HustleHub+ | Connecting skills with opportunity.
            </footer>

        </div>
    );
}

export default ExploreGigs;
