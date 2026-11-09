
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/MyGigs.css';

//region My Gigs Page
function MyGigs() {
    const [gigs, setGigs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingGig, setEditingGig] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingGigId, setDeletingGigId] = useState(null);

    //region Retrieve Freelancer Gigs
    const fetchGigs = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await api.get('/gigs/mine');
            setGigs(response.data.data || []);
        } catch (requestError) {
            setError(
                requestError.response?.data?.error?.message ||
                'Unable to retrieve your gigs. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGigs();
    }, [fetchGigs]);
    //endregion

    //region Start Editing Gig
    const startEditing = (gig) => {
        setEditingGig({
            id: gig.id,
            title: gig.title,
            description: gig.description,
            category: gig.category,
            price: String(gig.price),
            deliveryDays: String(gig.deliveryDays)
        });

        setError('');
        setSuccess('');
    };
    //endregion

    //region Handle Edit Form Changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setEditingGig(previous => ({
            ...previous,
            [name]: value
        }));
    };
    //endregion

    //region Update Existing Gig
    const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            setIsSaving(true);
            setError('');
            setSuccess('');

            await api.put(`/gigs/${editingGig.id}`, {
                title: editingGig.title,
                description: editingGig.description,
                category: editingGig.category,
                price: Number(editingGig.price),
                deliveryDays: Number(editingGig.deliveryDays)
            });

            setEditingGig(null);
            setSuccess('Your gig has been updated successfully.');

            await fetchGigs();
        } catch (requestError) {
            setError(
                requestError.response?.data?.error?.message ||
                'Unable to update your gig. Please check your details.'
            );
        } finally {
            setIsSaving(false);
        }
    };
    //endregion

    //region Delete Existing Gig
    const handleDelete = async (gigId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this gig? This action cannot be undone.'
        );

        if (!confirmed) return;

        try {
            setDeletingGigId(gigId);
            setError('');
            setSuccess('');

            await api.delete(`/gigs/${gigId}`);

            if (editingGig?.id === gigId) {
                setEditingGig(null);
            }

            setSuccess('Your gig has been deleted successfully.');

            await fetchGigs();
        } catch (requestError) {
            setError(
                requestError.response?.data?.error?.message ||
                'Unable to delete your gig. Please try again.'
            );
        } finally {
            setDeletingGigId(null);
        }
    };
    //endregion

    //region Format Currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(price);
    };
    //endregion

    return (
        <div className="my-gigs-page">
            <header className="my-gigs-header">
                <Link to="/" className="my-gigs-brand">
                    HustleHub<span>+</span>
                </Link>

                <nav>
                    <Link to="/gigs">Explore Gigs</Link>
                    <Link to="/dashboard">Dashboard</Link>
                </nav>

                <Link to="/gigs/create" className="my-gigs-create-button">
                    Create a gig
                </Link>
            </header>

            <main className="my-gigs-content">
                <section className="my-gigs-heading">
                    <span>FREELANCER WORKSPACE</span>
                    <h1>My gigs</h1>
                    <p>
                        Manage your services, update your listings
                        and keep your marketplace offerings current.
                    </p>
                </section>

                {success && (
                    <div className="my-gigs-success" role="status">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="my-gigs-error" role="alert">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="my-gigs-message">
                        Loading your gigs...
                    </div>
                ) : gigs.length === 0 ? (
                    <div className="my-gigs-empty">
                        <h2>You have not published any gigs yet.</h2>
                        <p>Create your first gig to start offering services.</p>
                        <Link to="/gigs/create" className="my-gigs-create-button">
                            Create your first gig
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="my-gigs-summary">
                            <h2>Your published services</h2>
                            <span>{gigs.length} gigs</span>
                        </div>

                        <div className="my-gigs-list">
                            {gigs.map(gig => (
                                <article className="my-gig-card" key={gig.id}>
                                    <div className="my-gig-information">
                                        <span className="my-gig-category">
                                            {gig.category}
                                        </span>

                                        <h3>{gig.title}</h3>

                                        <p>{gig.description}</p>

                                        <div className="my-gig-meta">
                                            <span>{formatPrice(gig.price)}</span>
                                            <span>{gig.deliveryDays} days delivery</span>
                                            <span className="my-gig-status">
                                                {gig.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-gig-actions">
                                        <button
                                            type="button"
                                            className="my-gig-edit-button"
                                            onClick={() => startEditing(gig)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="my-gig-delete-button"
                                            onClick={() => handleDelete(gig.id)}
                                            disabled={deletingGigId === gig.id}
                                        >
                                            {deletingGigId === gig.id
                                                ? 'Deleting...'
                                                : 'Delete'}
                                        </button>
                                    </div>

                                    {editingGig?.id === gig.id && (
                                        <form
                                            className="my-gig-edit-form"
                                            onSubmit={handleUpdate}
                                        >
                                            <h4>Edit gig details</h4>

                                            <label htmlFor="edit-title">
                                                Gig title
                                            </label>
                                            <input
                                                id="edit-title"
                                                name="title"
                                                value={editingGig.title}
                                                onChange={handleChange}
                                                minLength={5}
                                                maxLength={100}
                                                required
                                            />

                                            <label htmlFor="edit-description">
                                                Description
                                            </label>
                                            <textarea
                                                id="edit-description"
                                                name="description"
                                                value={editingGig.description}
                                                onChange={handleChange}
                                                minLength={20}
                                                maxLength={2000}
                                                rows={4}
                                                required
                                            />

                                            <label htmlFor="edit-category">
                                                Category
                                            </label>
                                            <input
                                                id="edit-category"
                                                name="category"
                                                value={editingGig.category}
                                                onChange={handleChange}
                                                maxLength={50}
                                                required
                                            />

                                            <div className="my-gig-edit-fields">
                                                <div>
                                                    <label htmlFor="edit-price">
                                                        Price (ZAR)
                                                    </label>
                                                    <input
                                                        id="edit-price"
                                                        name="price"
                                                        type="number"
                                                        value={editingGig.price}
                                                        onChange={handleChange}
                                                        min="1"
                                                        max="1000000"
                                                        step="0.01"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="edit-delivery">
                                                        Delivery days
                                                    </label>
                                                    <input
                                                        id="edit-delivery"
                                                        name="deliveryDays"
                                                        type="number"
                                                        value={editingGig.deliveryDays}
                                                        onChange={handleChange}
                                                        min="1"
                                                        max="365"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="my-gig-edit-actions">
                                                <button
                                                    type="submit"
                                                    disabled={isSaving}
                                                >
                                                    {isSaving
                                                        ? 'Saving...'
                                                        : 'Save changes'}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setEditingGig(null)}
                                                    disabled={isSaving}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
//endregion

export default MyGigs;
