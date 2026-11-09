import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../styles/Dashboard.css';


function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

        if (!user) {
            return (
                <div style={{ padding: '40px', color: '#17172d' }}>
                    <h1>No authenticated user found.</h1>
                    <p>Please sign in again.</p>
                    <button onClick={() => navigate('/login')}>
                        Go to login
                    </button>
                </div>
            );
        }

    const isFreelancer = user.role === 'freelancer';

    return (
        <div className="dashboard-page">

            <header className="dashboard-navbar">
                <Link to="/" className="dashboard-brand">
                    HustleHub<span>+</span>
                </Link>

                <div className="dashboard-user">
                    <span>{user.fullName}</span>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="dashboard-logout"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <main className="dashboard-content">

                <section className="dashboard-welcome">
                    <span className="section-overline">
                        {isFreelancer ? 'FREELANCER WORKSPACE' : 'CLIENT WORKSPACE'}
                    </span>

                    <h1>
                        Welcome back, {user.fullName}.
                    </h1>

                    <p>
                        {isFreelancer
                            ? 'Manage your services, track bookings and grow your freelance business.'
                            : 'Discover talented professionals and manage your service bookings.'
                        }
                    </p>

                    <span className="dashboard-role">
                        {isFreelancer ? 'Freelancer account' : 'Client account'}
                    </span>
                </section>

                <section className="dashboard-section">
                    <h2>Your workspace</h2>

                    <div className="dashboard-grid">

                        {isFreelancer ? (
                            <>
                                <article className="dashboard-card">
                                    <span className="dashboard-card-label">
                                        SERVICES
                                    </span>
                                    <h3>My gigs</h3>
                                    <p>
                                        Create and manage the services you offer.
                                    </p>
                                    <Link to="/gigs">
                                        Manage gigs
                                    </Link>
                                </article>

                                <article className="dashboard-card">
                                    <span className="dashboard-card-label">
                                        BOOKINGS
                                    </span>
                                    <h3>My bookings</h3>
                                    <p>
                                        View service requests from clients.
                                    </p>
                                    <Link to="/bookings">
                                        View bookings
                                    </Link>
                                </article>

                                <article className="dashboard-card">
                                    <span className="dashboard-card-label">
                                        EARNINGS
                                    </span>
                                    <h3>My income</h3>
                                    <p>
                                        Review your simulated transactions and earnings.
                                    </p>
                                    <Link to="/income">
                                        View income
                                    </Link>
                                </article>
                            </>
                        ) : (
                            <>
                                <article className="dashboard-card">
                                    <span className="dashboard-card-label">
                                        MARKETPLACE
                                    </span>
                                    <h3>Explore services</h3>
                                    <p>
                                        Find professionals offering services you need.
                                    </p>
                                    <Link to="/gigs">
                                        Browse services
                                    </Link>
                                </article>

                                <article className="dashboard-card">
                                    <span className="dashboard-card-label">
                                        BOOKINGS
                                    </span>
                                    <h3>My bookings</h3>
                                    <p>
                                        Keep track of your service requests.
                                    </p>
                                    <Link to="/bookings">
                                        View bookings
                                    </Link>
                                </article>

                                <article className="dashboard-card">
                                    <span className="dashboard-card-label">
                                        ACCOUNT
                                    </span>
                                    <h3>My profile</h3>
                                    <p>
                                        View your HustleHub+ account details.
                                    </p>
                                    <Link to="/profile">
                                        View profile
                                    </Link>
                                </article>
                            </>
                        )}

                    </div>
                </section>

            </main>

            <footer className="dashboard-footer">
                HustleHub+ | Connecting skills with opportunity.
            </footer>

        </div>
    );
}
export default Dashboard;
