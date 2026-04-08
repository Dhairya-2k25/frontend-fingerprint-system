import React, { useState } from 'react';
import { TxRow } from './WalletTab';

export default function TransactionsTab({ transactions, members }) {
    const [txFilter, setTxFilter] = useState('All');

    const filteredTx = txFilter === 'All'
        ? transactions
        : transactions.filter(t => t.memberName === txFilter);

    return (
        <div className="fade-in max-w-lg">
            <div className="tx-card">
                <div className="tx-header">
                    <h3 className="tx-header-title">
                        <i className="fas fa-bolt" style={{ color: '#a855f7', marginRight: '0.5rem' }} />
                        Activity
                    </h3>
                    <select className="filter-select-solid" value={txFilter} onChange={e => setTxFilter(e.target.value)}>
                        <option value="All">All</option>
                        {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </select>
                </div>
                <div className="tx-list-solid">
                    {filteredTx.length === 0
                        ? <div className="empty-tx"><i className="fas fa-receipt" /><p>No transactions found.</p></div>
                        : filteredTx.map(tx => <TxRow key={tx.id} tx={tx} showMember />)
                    }
                </div>
            </div>
        </div>
    );
}
