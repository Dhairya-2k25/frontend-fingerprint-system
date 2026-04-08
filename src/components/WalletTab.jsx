import React, { useState } from 'react';

const getWalletColor = (balance) => {
    let ratio = Math.min(Math.max(balance / 5000, 0), 1);
    const h = 25 + ratio * 80;
    const s = 55 + ratio * 20;
    const l = 22 + ratio * 10;
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
};

export function TxRow({ tx, showMember = false }) {
    const isDeposit = tx.type === 'deposit';
    return (
        <div className="tx-item-solid">
            <div className="tx-left">
                <div className={`tx-icon-solid ${isDeposit ? 'inc-solid' : 'out-solid'}`}>
                    <i className={`fas ${isDeposit ? 'fa-arrow-down' : 'fa-arrow-up'}`} />
                </div>
                <div>
                    <div className="tx-brand-solid">
                        {tx.brand}
                        <span className={`tx-type-pill ${isDeposit ? 'pill-in' : 'pill-out'}`}>
                            {isDeposit ? 'IN' : 'OUT'}
                        </span>
                    </div>
                    <div className="tx-details-solid">
                        {showMember
                            ? `${new Date(tx.date).toLocaleString()} • ${tx.memberName}`
                            : `${new Date(tx.date).toLocaleDateString()} • ${new Date(tx.date).toLocaleTimeString()}`
                        }
                    </div>
                </div>
            </div>
            <div className={`tx-amt-solid ${isDeposit ? 'text-green' : 'text-red'}`}>
                {isDeposit ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
            </div>
        </div>
    );
}

export default function WalletTab({ balance, transactions, setModal }) {
    return (
        <div className="fade-in max-w-lg">
            <div className="green-wallet-card" style={{ background: getWalletColor(balance) }}>
                <div className="dots"><span /><span /></div>
                <div className="balance-wrap">
                    <div className="rs">₹</div>
                    <div className="bal-amt">{balance.toFixed(2)}</div>
                </div>
                <div className="bal-lbl">Left</div>
                <div className="bottom-lbl">Available Balance</div>
                <div className="wave1" /><div className="wave2" />
            </div>

            <div className="flex-row gap-1">
                <button className="btn-primary flex-1" onClick={() => setModal('deposit')}>
                    <i className="fas fa-plus" /> Deposit Money
                </button>
            </div>

            {/* Recent Transactions */}
            <div className="mt-2">
                <div className="tx-card">
                    <div className="tx-header">
                        <h3 className="tx-header-title">
                            <i className="fas fa-history" style={{ color: '#6366f1', marginRight: '0.5rem' }} />
                            Recent Transactions
                        </h3>
                    </div>
                    <div className="tx-list-solid">
                        {transactions.length === 0
                            ? <div className="empty-tx"><i className="fas fa-receipt" /><p>No transactions yet.</p></div>
                            : transactions.slice(0, 3).map(tx => <TxRow key={tx.id} tx={tx} />)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
