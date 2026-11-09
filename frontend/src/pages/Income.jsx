
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Income.css';

function Income() {
    const [income, setIncome] = useState({
        totalIncome: 0,
        lifetimeIncome: 0,
        transactionCount: 0,
        completedTransactionCount: 0,
        taxYearCompletedTransactionCount: 0,
        taxableIncome: 0,
        taxBeforeRebate: 0,
        primaryRebate: 17820,
        estimatedTax: 0,
        afterTaxIncome: 0,
        effectiveTaxRate: 0,
        taxYear: '2026/2027',
        transactions: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    //region Functionality for Retrieving Freelancer Income

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

    //endregion

    //region Income Formatting Functions

    const formatPrice = (amount) =>
        new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(Number(amount) || 0);

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

    //endregion

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
                        Track your completed bookings, estimated income tax
                        and take-home income.
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
                        {/*region Tax Year Income Summary*/}

                        <section className="income-tax-summary">
                            <div className="income-section-heading">
                                <div>
                                    <span className="income-overline">
                                        TAX YEAR {income.taxYear || '2026/2027'}
                                    </span>

                                    <h2>Income and tax overview</h2>

                                    <p>
                                        1 March 2026 – 28 February 2027
                                    </p>
                                </div>
                            </div>

                            <div className="income-summary">
                                <article className="income-summary-card income-total-card">
                                    <span>Gross approved income</span>

                                    <strong>
                                        {formatPrice(income.totalIncome)}
                                    </strong>

                                    <p>
                                        {income.taxYearCompletedTransactionCount || 0}
                                        {' '}completed transactions in this tax year
                                    </p>
                                </article>

                                <article className="income-summary-card income-tax-card">
                                    <span>Estimated income tax</span>

                                    <strong>
                                        {formatPrice(income.estimatedTax)}
                                    </strong>

                                    <p>
                                        After applying the primary tax rebate
                                    </p>
                                </article>

                                <article className="income-summary-card income-after-tax-card">
                                    <span>Estimated after-tax income</span>

                                    <strong>
                                        {formatPrice(income.afterTaxIncome)}
                                    </strong>

                                    <p>
                                        Gross income less estimated tax
                                    </p>
                                </article>

                                <article className="income-summary-card">
                                    <span>Lifetime approved income</span>

                                    <strong>
                                        {formatPrice(income.lifetimeIncome)}
                                    </strong>

                                    <p>
                                        All client-approved completed transactions
                                    </p>
                                </article>
                            </div>
                        </section>

                        {/*endregion*/}

                        {/*region Tax Calculation Breakdown*/}

                        <section className="income-tax-breakdown">
                            <div className="income-section-heading">
                                <div>
                                    <span className="income-overline">
                                        TAX CALCULATION
                                    </span>

                                    <h2>How your estimate is calculated</h2>
                                </div>

                                <div className="income-tax-rate">
                                    <span>Effective tax rate</span>

                                    <strong>
                                        {(Number(income.effectiveTaxRate) || 0).toFixed(2)}%
                                    </strong>
                                </div>
                            </div>

                            <div className="income-tax-details">
                                <div className="income-tax-detail-row">
                                    <span>Taxable income</span>

                                    <strong>
                                        {formatPrice(income.taxableIncome)}
                                    </strong>
                                </div>

                                <div className="income-tax-detail-row">
                                    <span>Tax before rebate</span>

                                    <strong>
                                        {formatPrice(income.taxBeforeRebate)}
                                    </strong>
                                </div>

                                <div className="income-tax-detail-row">
                                    <span>Primary tax rebate</span>

                                    <strong className="income-rebate">
                                        - {formatPrice(income.primaryRebate)}
                                    </strong>
                                </div>

                                <div className="income-tax-detail-row income-tax-final-row">
                                    <span>Estimated tax payable</span>

                                    <strong>
                                        {formatPrice(income.estimatedTax)}
                                    </strong>
                                </div>
                            </div>

                            <div className="income-tax-explanation">
                                <h3>Understanding the estimate</h3>

                                <p>
                                    HustleHub+ calculates an approximate
                                    annual income tax amount using South
                                    Africa's progressive individual income
                                    tax brackets for the 2026/2027 tax year.
                                </p>

                                <p>
                                    Income is calculated from client-approved
                                    completed transactions. The applicable
                                    tax rate increases across income brackets.
                                    The primary rebate of R17,820 is then
                                    deducted from the calculated tax, with
                                    the final estimate never falling below zero.
                                </p>

                                <p>
                                    This simplified estimate assumes the
                                    taxpayer is under 65 and qualifies for
                                    the primary rebate only. It does not
                                    include other income, deductible business
                                    expenses, medical tax credits or
                                    additional rebates.
                                </p>

                                <p className="income-tax-disclaimer">
                                    This is an educational estimate, not an
                                    official SARS assessment or professional
                                    tax advice. Actual tax liability may differ.
                                </p>

                                <a
                                    href="https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="income-tax-source"
                                >
                                    View official SARS tax rates
                                </a>
                            </div>
                        </section>

                        {/*endregion*/}

                        {/*region Transaction Summary*/}

                        <section className="income-transaction-summary">
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

                                <p>All client-approved transactions</p>
                            </article>
                        </section>

                        {/*endregion*/}

                        {/*region Transaction History*/}

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
                                            {income.transactions.map(transaction => (
                                                <tr key={transaction.id}>
                                                    <td>
                                                        {transaction.id
                                                            .slice(0, 8)
                                                            .toUpperCase()}
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            transaction.completedAt ||
                                                            transaction.createdAt
                                                        )}
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

                        {/*endregion*/}
                    </>
                )}
            </main>
        </div>
    );
}

export default Income;
