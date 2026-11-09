import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Income.css';

function Income() {
    const [income, setIncome] = useState({
        totalIncome: 0,
        transactionCount: 0,
        completedTransactionCount: 0,
        transactions: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                setIsLoading(true);
                setError('');

                const response = await api.get('/transactions/income');

                setIncome(response.data.data);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.error?.message ||
                    'Unable to retrieve your income information.'
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchIncome();
    }, []);

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

    const formatStatus = (status) =>
        (status || 'unknown')
            .replaceAll('_', ' ')
            .replace(/\b\w/g, character => character.toUpperCase());

    return (
        <div className="income-page">
            <header className="income-header">
                <Link to="/dashboard" className="income-brand">
                    HustleHub<span>+</span>
                </Link>

                <Link to="/dashboard" className="income-back-link">
                    Back to dashboard
                </Link>
            </header>

            <main className="income-main">
                <div className="income-heading">
                    <span className="income-overline">
                        FREELANCER FINANCIAL OVERVIEW
                    </span>

                    <h1>My income</h1>

                    <p>
                        Track your bookings, transaction statuses and approved income.
                    </p>
                </div>

                {isLoading && (
                    <p className="income-message">
                        Loading your income...
                    </p>
                )}

                {!isLoading && error && (
                    <div className="income-error" role="alert">
                        {error}
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        <section className="income-summary">
                            <article className="income-summary-card income-total-card">
                                <span>Approved income</span>

                                <strong>
                                    {formatPrice(income.totalIncome)}
                                </strong>

                                <p>
                                    Only client-approved completed transactions
                                </p>
                            </article>

                            <article className="income-summary-card">
                                <span>Total transactions</span>

                                <strong>
                                    {income.transactionCount}
                                </strong>

                                <p>All recorded booking transactions</p>
                            </article>

                            <article className="income-summary-card">
                                <span>Completed transactions</span>

                                <strong>
                                    {income.completedTransactionCount}
                                </strong>

                                <p>Transactions approved by clients</p>
                            </article>
                        </section>

                        <section className="income-history">
                            <div className="income-section-heading">
                                <div>
                                    <span className="income-overline">
                                        TRANSACTION RECORDS
                                    </span>

                                    <h2>Income history</h2>
                                </div>
                            </div>

                            {income.transactions.length === 0 ? (
                                <div className="income-empty">
                                    <h3>No transactions yet</h3>

                                    <p>
                                        Transactions from client bookings
                                        will appear here.
                                    </p>

                                    <Link to="/gigs" className="income-action">
                                        Explore marketplace
                                    </Link>
                                </div>
                            ) : (
                                <div className="income-table-wrapper">
                                    <table className="income-table">
                                        <thead>
                                            <tr>
                                                <th>Transaction</th>
                                                <th>Date</th>
                                                <th>Payment method</th>
                                                <th>Booking status</th>
                                                <th>Transaction status</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {income.transactions.map((transaction) => (
                                                <tr key={transaction.id}>
                                                    <td>
                                                        {transaction.id
                                                            .slice(0, 8)
                                                            .toUpperCase()}
                                                    </td>

                                                    <td>
                                                        {formatDate(transaction.createdAt)}
                                                    </td>

                                                    <td>
                                                        {formatStatus(transaction.paymentMethod)}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`income-status status-${transaction.bookingStatus || 'unknown'}`}
                                                        >
                                                            {formatStatus(transaction.bookingStatus)}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`income-status status-${transaction.status || 'unknown'}`}
                                                        >
                                                            {formatStatus(transaction.status)}
                                                        </span>
                                                    </td>

                                                    <td className="income-amount">
                                                        {formatPrice(transaction.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default Income;