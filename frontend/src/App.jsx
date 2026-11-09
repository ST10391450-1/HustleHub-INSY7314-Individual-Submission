import { Link, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ExploreGigs from './pages/ExploreGigs';
import CreateGig from './pages/CreateGig';
import MyGigs from './pages/MyGigs';
import Bookings from './pages/Bookings';
import Income from './pages/Income';
import './App.css';

const categories = [
    { code: 'DEV', name: 'Programming & Tech', description: 'Websites, apps and software' },
    { code: 'DES', name: 'Graphics & Design', description: 'Logos, branding and visuals' },
    { code: 'WRT', name: 'Writing & Translation', description: 'Articles, content and editing' },
    { code: 'MKT', name: 'Digital Marketing', description: 'SEO, social media and advertising' },
    { code: 'VID', name: 'Video & Animation', description: 'Video editing and motion design' },
    { code: 'BUS', name: 'Business', description: 'Consulting and business support' }
];

const featuredGigs = [
    {
        category: 'WEB DEVELOPMENT',
        title: 'I will build a modern, responsive business website',
        freelancer: 'Web Development Specialist',
        price: 'R 1,500',
        rating: '5.0'
    },
    {
        category: 'GRAPHIC DESIGN',
        title: 'I will design a professional logo for your business',
        freelancer: 'Graphic Design Specialist',
        price: 'R 450',
        rating: '4.9'
    },
    {
        category: 'DIGITAL MARKETING',
        title: 'I will manage your social media presence',
        freelancer: 'Social Media Specialist',
        price: 'R 800',
        rating: '5.0'
    }
];

function HomePage() {
    return (
        <div className="app">

            <header className="navbar">
                <a href="#" className="brand">
                    HustleHub<span>+</span>
                </a>

                <nav className="nav-links">
                    <a href="#categories">Explore</a>
                    <a href="#how-it-works">How it works</a>
                    <a href="#featured">Find services</a>
                </nav>

                <div className="nav-actions">
                   <Link to="/login" className="login-link">Log in</Link>
                  <Link to="/register" className="button button-primary nav-button">
                      Join HustleHub+
                  </Link>
                </div>
            </header>

            <main>

                <section className="hero-section">
                    <div className="hero-content">

                        <div className="hero-label">
                            <span className="status-dot"></span>
                            YOUR TALENT. YOUR OPPORTUNITY.
                        </div>

                        <h1>
                            Great work starts with
                            <span> the right connection.</span>
                        </h1>

                        <p>
                            Connect with talented freelancers, discover professional
                            services and turn your ideas into reality.
                        </p>

                        <form className="search-form" onSubmit={(event) => event.preventDefault()}>
                            <input
                                type="search"
                                placeholder="What service are you looking for?"
                                aria-label="Search for a service"
                            />
                            <button type="submit" className="button button-primary">
                                Search services
                            </button>
                        </form>

                        <div className="popular-searches">
                            <span>Popular:</span>
                            <a href="#featured">Web Design</a>
                            <a href="#featured">Logo Design</a>
                            <a href="#featured">Social Media</a>
                        </div>

                    </div>

                    <div className="hero-visual">
                        <div className="visual-card visual-card-main">
                            <span className="visual-overline">THE FUTURE OF FREELANCING</span>
                            <div className="visual-graphic">
                                <div className="graphic-line graphic-line-one"></div>
                                <div className="graphic-line graphic-line-two"></div>
                                <div className="graphic-block"></div>
                                <div className="graphic-circle"></div>
                            </div>
                            <h3>Make your next move count.</h3>
                            <p>Find opportunities. Build connections. Grow.</p>
                        </div>

                        <div className="visual-card visual-card-small">
                            <span className="small-card-label">YOUR NEXT OPPORTUNITY</span>
                            <strong>Starts here.</strong>
                            <span className="small-card-line"></span>
                        </div>
                    </div>
                </section>

                <section className="categories-section" id="categories">
                    <div className="section-heading">
                        <div>
                            <span className="section-overline">EXPLORE THE MARKETPLACE</span>
                            <h2>Find the right service</h2>
                            <p>Discover skilled professionals across popular categories.</p>
                        </div>

                        <a href="#featured" className="text-link">Explore services &rarr;</a>
                    </div>

                    <div className="category-grid">
                        {categories.map((category) => (
                            <a href="#featured" className="category-card" key={category.code}>
                                <span className="category-code">{category.code}</span>
                                <h3>{category.name}</h3>
                                <p>{category.description}</p>
                                <span className="category-arrow">&rarr;</span>
                            </a>
                        ))}
                    </div>
                </section>

                <section className="featured-section" id="featured">
                    <div className="section-heading">
                        <div>
                            <span className="section-overline">HANDPICKED SERVICES</span>
                            <h2>Featured services</h2>
                            <p>Explore services from talented professionals.</p>
                        </div>

                        <a href="#categories" className="text-link">View all services &rarr;</a>
                    </div>

                    <div className="gig-grid">
                        {featuredGigs.map((gig) => (
                            <article className="gig-card" key={gig.title}>
                                <div className="gig-placeholder">
                                    <span>{gig.category}</span>
                                    <div className="gig-placeholder-shape"></div>
                                </div>

                                <div className="gig-details">
                                    <span className="gig-category">{gig.category}</span>
                                    <h3>{gig.title}</h3>

                                    <div className="gig-freelancer">
                                        <span className="freelancer-avatar">HH</span>
                                        <span>{gig.freelancer}</span>
                                    </div>

                                    <div className="gig-footer">
                                        <span className="gig-rating">
                                            <span className="rating-star">★</span>
                                            {gig.rating}
                                        </span>

                                        <div className="gig-price">
                                            <span>Starting at</span>
                                            <strong>{gig.price}</strong>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="how-section" id="how-it-works">
                    <div className="how-heading">
                        <span className="section-overline">SIMPLE. SECURE. STRAIGHTFORWARD.</span>
                        <h2>How HustleHub+ works</h2>
                        <p>Getting started takes just three simple steps.</p>
                    </div>

                    <div className="steps-grid">
                        <article className="step-card">
                            <span className="step-number">01</span>
                            <h3>Create an account</h3>
                            <p>Join as a client looking for services or a freelancer offering skills.</p>
                        </article>

                        <article className="step-card">
                            <span className="step-number">02</span>
                            <h3>Find your match</h3>
                            <p>Explore available services and connect with the right professional.</p>
                        </article>

                        <article className="step-card">
                            <span className="step-number">03</span>
                            <h3>Get things done</h3>
                            <p>Book services, track your bookings and manage your work.</p>
                        </article>
                    </div>
                </section>

                <section className="cta-section">
                    <div>
                        <span className="section-overline">YOUR NEXT CHAPTER STARTS HERE</span>
                        <h2>Ready to make something happen?</h2>
                        <p>Join a marketplace built around skills, opportunity and growth.</p>
                    </div>

                  <Link to="/register" className="button button-light">
                      Get started
                      <span>&rarr;</span>
                  </Link>
                </section>

            </main>

            <footer className="footer">
                <a href="#" className="brand">
                    HustleHub<span>+</span>
                </a>

                <p>Connecting skills with opportunity.</p>

                <span className="footer-copy">
                    &copy; {new Date().getFullYear()} HustleHub+. All rights reserved.
                </span>
            </footer>

        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/gigs" element={<ExploreGigs />} />
            <Route
                path="/gigs/create"
                element={
                    <ProtectedRoute>
                        <CreateGig />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gigs/mine"
                element={
                    <ProtectedRoute>
                        <MyGigs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bookings"
                element={
                    <ProtectedRoute>
                        <Bookings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="*"
                element={<HomePage />}
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }/>
                <Route
                path="/income"
                element={
                    <ProtectedRoute>
                        <Income />
                    </ProtectedRoute>
                }
            />
                
        </Routes>
    );
}

export default App;