import React, { useState } from 'react';
import { makeTransaction } from '../services/api';

export default function MakeTransactionTab({ currentUser, token, setIsLoading }) {
    const [amount, setAmount] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleTransaction = async (e) => {
        e.preventDefault();

        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            setStatusMessage("Please enter a valid amount greater than 0");
            setIsError(true);
            return;
        }

        setIsScanning(true);
        setStatusMessage(null);
        setIsError(false);

        try {
            const res = await makeTransaction(token, currentUser.id, numericAmount);

            if (res.success) {
                setStatusMessage(`Transaction of ₹${numericAmount} successful!`);
                setIsError(false);
                setAmount('');
            } else {
                // Transaction failed — stop scanning immediately and show error
                setStatusMessage(res.message || "Transaction failed");
                setIsError(true);
            }
        } catch (err) {
            setStatusMessage("Network error — please try again");
            setIsError(true);
        } finally {
            // Always stop the spinner when backend responds
            setIsScanning(false);
        }
    };

    return (
        <div className="glass-card full-height">
            <div className="card-header">
                <h2>
                    <i className="fas fa-cash-register" style={{ color: '#a855f7', marginRight: '0.5rem' }} />
                    Point of Sale
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Initiate a hardware fingerprint transaction to charge a customer.
                </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
                {statusMessage && (
                    <div
                        className={isError ? "error-box" : "success-box"}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            background: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                            color: isError ? '#ef4444' : '#22c55e',
                            border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`
                        }}
                    >
                        <i className={`fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`} />
                        {statusMessage}
                    </div>
                )}

                <form onSubmit={handleTransaction}>
                    <div className="input-field">
                        <i className="fas fa-rupee-sign" />
                        <input
                            type="number"
                            placeholder="Enter amount to charge (₹)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isScanning}
                        style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}
                    >
                        <i
                            className={isScanning ? "fas fa-spinner fa-spin" : "fas fa-fingerprint"}
                            style={{ marginRight: '0.5rem' }}
                        />
                        {isScanning ? 'Scanning Fingerprint...' : 'Configure Scanner & Charge'}
                    </button>
                </form>
            </div>
        </div>
    );
}
