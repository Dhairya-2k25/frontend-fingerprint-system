import React, { useState } from 'react';
import { depositMoney } from '../services/api';

export default function DepositModal({ token, setModal, refreshWallet, isLoading, setIsLoading }) {
    const [depAmount, setDepAmount] = useState('');
    const [depPass, setDepPass] = useState('');
    const [depError, setDepError] = useState('');

    const handleDeposit = async () => {
        const amt = parseFloat(depAmount);
        if (!amt || amt <= 0) { setDepError('Enter a valid amount.'); return; }
        if (!depPass) { setDepError('Password is required.'); return; }

        setIsLoading(true);
        const res = await depositMoney(token, amt, depPass);
        setIsLoading(false);

        if (!res.success) {
            setDepError(res.message || 'Deposit failed.');
            return;
        }
        setModal(null);
        setDepAmount(''); setDepPass(''); setDepError('');
        await refreshWallet();
    };

    return (
        <div className="modal-content">
            <h3>Deposit Money</h3>
            {depError && <div className="error-box mt-1 mb-1">{depError}</div>}
            <div className="input-field mt-2">
                <i className="fas fa-rupee-sign" />
                <input
                    type="number"
                    placeholder="Amount"
                    value={depAmount}
                    onChange={e => setDepAmount(e.target.value)}
                />
            </div>
            <div className="input-field">
                <i className="fas fa-lock" />
                <input
                    type="password"
                    placeholder="Verify Password"
                    value={depPass}
                    onChange={e => setDepPass(e.target.value)}
                />
            </div>
            <button className="btn-primary mt-1" onClick={handleDeposit} disabled={isLoading}>
                {isLoading ? 'Processing…' : 'Confirm Deposit'}
            </button>
        </div>
    );
}
