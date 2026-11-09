import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Bookings.css';

function Bookings() {
    const { user } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [actionMessage, setActionMessage] = useState('');
    const [updatingBookingId, setUpdatingBookingId] = useState(null);

    const isFreelancer = user?.role === 'freelancer';

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                setError('');

                const endpoint = isFreelancer
                    ? '/bookings/mine/freelancer'
                    : '/bookings/mine/client';

                const response = await api.get(endpoint);

                setBookings(response.data.data || []);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.error?.message ||
                    'Unable to load your bookings. Please try again.'
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [isFreelancer]);

    const formatPrice = (amount) =>
        new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

    const handleFreelancerStatusUpdate = async (booking, status) => {
        try {
            setUpdatingBookingId(booking.id);
            setActionError('');
            setActionMessage('');

            const response = await api.patch(
                `/bookings/${booking.id}/status`,
                { status }
            );

            const updatedBooking = response.data.data;

            setBookings((currentBookings) =>
                currentBookings.map((currentBooking) =>
                    currentBooking.id === updatedBooking.id
                        ? updatedBooking
                        : currentBooking
                )
            );

            setActionMessage(
                status === 'accepted'
                    ? 'Booking accepted successfully.'
                    : status === 'rejected'
                        ? 'Booking rejected successfully.'
                        : 'Completed work submitted to the client for approval.'
            );
        } catch (requestError) {
            setActionError(
                requestError.response?.data?.error?.message ||
                'Unable to update the booking status. Please try again.'
            );
        } finally {
            setUpdatingBookingId(null);
        }
    };

    const handleClientStatusUpdate = async (booking, status) => {
        try {
            setUpdatingBookingId(booking.id);
            setActionError('');
            setActionMessage('');

            const response = await api.patch(
                `/bookings/${booking.id}/client-status`,
                { status }
            );

            const updatedBooking = response.data.data;

            setBookings((currentBookings) =>
                currentBookings.map((currentBooking) =>
                    currentBooking.id === updatedBooking.id
                        ? updatedBooking
                        : currentBooking
                )
            );

            setActionMessage(
                status === 'completed'
                    ? 'Work approved successfully. The booking is now completed.'
                    : 'Revision requested. The freelancer can now submit updated work.'
            );
        } catch (requestError) {
            setActionError(
                requestError.response?.data?.error?.message ||
                'Unable to update the booking status. Please try again.'
            );
        } finally {
            setUpdatingBookingId(null);
        }
    };
    //endregion

    return (
        <div className="bookings-page">
            <header className="bookings-header">
                <Link to="/dashboard" className="bookings-brand">
                    HustleHub<span>+</span>
                </Link>

                <Link to="/dashboard" className="bookings-back-link">
                    Back to dashboard
                </Link>
            </header>

            <main className="bookings-main">
                <div className="bookings-heading">
                    <span className="bookings-overline">
                        {isFreelancer ? 'YOUR WORKSPACE' : 'YOUR ACTIVITY'}
                    </span>

                    <h1>
                        {isFreelancer ? 'Incoming bookings' : 'My bookings'}
                    </h1>

                    <p>
                        {isFreelancer
                            ? 'Manage service requests and submit completed work for client approval.'
                            : 'View your bookings, review submitted work and approve completed services.'}
                    </p>
                </div>

                {isLoading && (
                    <p className="bookings-message">
                        Loading bookings...
                    </p>
                )}

                {!isLoading && error && (
                    <div className="bookings-error" role="alert">
                        {error}
                    </div>
                )}

                {!isLoading && !error && actionError && (
                    <div className="bookings-error" role="alert">
                        {actionError}
                    </div>
                )}

                {!isLoading && !error && actionMessage && (
                    <div className="bookings-success" role="status">
                        {actionMessage}
                    </div>
                )}

                {!isLoading && !error && bookings.length === 0 && (
                    <div className="bookings-empty">
                        <h2>No bookings yet</h2>

                        <p>
                            {isFreelancer
                                ? 'New client bookings will appear here.'
                                : 'Explore available services to make your first booking.'}
                        </p>

                        <Link to="/gigs" className="bookings-action">
                            Explore services
                        </Link>
                    </div>
                )}

                {!isLoading && !error && bookings.length > 0 && (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <article
                                className="booking-card"
                                key={booking.id}
                            >
                                <div className="booking-card-top">
                                    <div>
                                        <span className="booking-label">
                                            BOOKING REFERENCE
                                        </span>

                                        <h2>
                                            {booking.id.slice(0, 8).toUpperCase()}
                                        </h2>
                                    </div>

                                    <span
                                        className={`booking-status status-${booking.status}`}
                                    >
                                        {booking.status.replaceAll('_', ' ')}
                                    </span>
                                </div>

                                <div className="booking-details">
                                    <div>
                                        <span>Gig ID</span>
                                        <strong>{booking.gigId}</strong>
                                    </div>

                                    <div>
                                        <span>Amount</span>
                                        <strong>
                                            {formatPrice(booking.amount)}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Date booked</span>
                                        <strong>
                                            {formatDate(booking.createdAt)}
                                        </strong>
                                    </div>
                                </div>

                                {/* Freelancer booking actions */}
                                {isFreelancer && (
                                    <div className="booking-actions">

                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    className="booking-button booking-accept"
                                                    disabled={updatingBookingId === booking.id}
                                                    onClick={() =>
                                                        handleFreelancerStatusUpdate(
                                                            booking,
                                                            'accepted'
                                                        )
                                                    }
                                                >
                                                    Accept booking
                                                </button>

                                                <button
                                                    className="booking-button booking-reject"
                                                    disabled={updatingBookingId === booking.id}
                                                    onClick={() =>
                                                        handleFreelancerStatusUpdate(
                                                            booking,
                                                            'rejected'
                                                        )
                                                    }
                                                >
                                                    Reject booking
                                                </button>
                                            </>
                                        )}

                                        {(booking.status === 'accepted' ||
                                            booking.status === 'revision_requested') && (
                                            <button
                                                className="booking-button booking-complete"
                                                disabled={updatingBookingId === booking.id}
                                                onClick={() =>
                                                    handleFreelancerStatusUpdate(
                                                        booking,
                                                        'submitted'
                                                    )
                                                }
                                            >
                                                {booking.status === 'revision_requested'
                                                    ? 'Resubmit completed work'
                                                    : 'Submit completed work'}
                                            </button>
                                        )}

                                        {booking.status === 'submitted' && (
                                            <p className="booking-message">
                                                Work submitted. Waiting for client approval.
                                            </p>
                                        )}

                                        {booking.status === 'completed' && (
                                            <p className="booking-message">
                                                The client approved this work. Booking completed.
                                            </p>
                                        )}

                                        {booking.status === 'rejected' && (
                                            <p className="booking-message">
                                                This booking was rejected.
                                            </p>
                                        )}

                                        {updatingBookingId === booking.id && (
                                            <span className="booking-updating">
                                                Updating...
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Client approval actions */}
                                {!isFreelancer && (
                                    <div className="booking-actions">

                                        {booking.status === 'submitted' && (
                                            <>
                                                <p className="booking-message">
                                                    The freelancer has submitted completed work.
                                                    Please review it before approving.
                                                </p>

                                                <button
                                                    className="booking-button booking-accept"
                                                    disabled={updatingBookingId === booking.id}
                                                    onClick={() =>
                                                        handleClientStatusUpdate(
                                                            booking,
                                                            'completed'
                                                        )
                                                    }
                                                >
                                                    Approve completed work
                                                </button>

                                                <button
                                                    className="booking-button booking-reject"
                                                    disabled={updatingBookingId === booking.id}
                                                    onClick={() =>
                                                        handleClientStatusUpdate(
                                                            booking,
                                                            'revision_requested'
                                                        )
                                                    }
                                                >
                                                    Request revisions
                                                </button>
                                            </>
                                        )}

                                        {booking.status === 'pending' && (
                                            <p className="booking-message">
                                                Waiting for the freelancer to respond.
                                            </p>
                                        )}

                                        {booking.status === 'accepted' && (
                                            <p className="booking-message">
                                                Your booking was accepted. Waiting for completed work.
                                            </p>
                                        )}

                                        {booking.status === 'revision_requested' && (
                                            <p className="booking-message">
                                                Revisions requested. Waiting for the freelancer to resubmit.
                                            </p>
                                        )}

                                        {booking.status === 'completed' && (
                                            <p className="booking-message">
                                                You approved this work. Booking completed.
                                            </p>
                                        )}

                                        {booking.status === 'rejected' && (
                                            <p className="booking-message">
                                                The freelancer rejected this booking.
                                            </p>
                                        )}

                                        {updatingBookingId === booking.id && (
                                            <span className="booking-updating">
                                                Updating...
                                            </span>
                                        )}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Bookings;