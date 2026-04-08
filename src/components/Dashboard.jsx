import React, { useState } from 'react';
import WalletTab from './WalletTab';
import TransactionsTab from './TransactionsTab';
import BiometricsTab from './BiometricsTab';
import ProfileTab from './ProfileTab';
import MakeTransactionTab from './MakeTransactionTab';
import DepositModal from './DepositModal';
import { updateFamilyMember } from '../services/api';


export default function Dashboard({
    currentUser,
    token,
    balance,
    transactions,
    members,
    setMembers,
    refreshWallet,
    handleLogout,
    isLoading,
    setIsLoading
}) {
    const isMerchant = currentUser?.role === 'merchant';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dashboardTab, setDashboardTab] = useState(isMerchant ? 'transactions' : 'wallet');

    // Modals state
    const [modal, setModal] = useState(null); // 'deposit' | 'limit'
    const [editLimitMember, setEditLimitMember] = useState(null);

    const getTabTitle = () => {
        switch (dashboardTab) {
            case 'wallet': return 'My Wallet';
            case 'transactions': return 'Transaction History';
            case 'biometrics': return 'Biometric Authentication';
            case 'profile': return 'My Profile';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>WebPortal</h3>
                    <i className="fas fa-times close-btn" onClick={() => setSidebarOpen(false)} />
                </div>
                <div className="sidebar-links">
                    {[
                        { id: 'make-transaction', icon: 'fa-cash-register', label: 'Make Transaction', hideForUser: true },
                        { id: 'wallet', icon: 'fa-wallet', label: 'My Wallet', hideForMerchant: true },
                        { id: 'transactions', icon: 'fa-list', label: 'Transaction History' },
                        { id: 'biometrics', icon: 'fa-fingerprint', label: 'Biometric Auth', hideForMerchant: true },
                        { id: 'profile', icon: 'fa-user-circle', label: 'My Profile', hideForMerchant: true },
                    ].filter(tab => !(isMerchant && tab.hideForMerchant) && !(!isMerchant && tab.hideForUser)).map(tab => (
                        <button
                            key={tab.id}
                            className={dashboardTab === tab.id ? 'active' : ''}
                            onClick={() => { setDashboardTab(tab.id); setSidebarOpen(false); }}
                        >
                            <i className={`fas ${tab.icon}`} /> {tab.label}
                        </button>
                    ))}
                </div>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="topbar">
                    <i className="fas fa-bars hamburger" onClick={() => setSidebarOpen(true)} />
                    <h2>{getTabTitle()}</h2>
                    <div className="user-badge"><i className="fas fa-user" /> {currentUser?.username}</div>
                </div>

                <div className="scroll-area">
                    {dashboardTab === 'make-transaction' && isMerchant && (
                        <MakeTransactionTab
                            currentUser={currentUser}
                            token={token}
                            setIsLoading={setIsLoading}
                        />
                    )}

                    {dashboardTab === 'wallet' && !isMerchant && (
                        <WalletTab
                            balance={balance}
                            transactions={transactions}
                            setModal={setModal}
                        />
                    )}

                    {dashboardTab === 'transactions' && (
                        <TransactionsTab
                            transactions={transactions}
                            members={members}
                        />
                    )}

                    {dashboardTab === 'biometrics' && !isMerchant && (
                        <BiometricsTab
                            members={members}
                            setMembers={setMembers}
                            setModal={setModal}
                            setEditLimitMember={setEditLimitMember}
                            token={token}
                            setIsLoading={setIsLoading}
                        />
                    )}

                    {dashboardTab === 'profile' && !isMerchant && (
                        <ProfileTab currentUser={currentUser} />
                    )}
                </div>
            </div>

            {/* Modals Overlay */}
            {modal && (
                <div className="modal-overlay" onClick={() => {
                    setModal(null);
                }} />
            )}

            {/* Deposit Modal */}
            {modal === 'deposit' && (
                <DepositModal
                    token={token}
                    setModal={setModal}
                    refreshWallet={refreshWallet}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            )}

            {/* Biometrics Limit Modal (Handled in Biometrics component directly or here) */}
            {modal === 'limit' && editLimitMember && (
                <div className="modal-content">
                    <h3>Set Limit for {editLimitMember.name}</h3>
                    <p className="text-muted text-sm mt-1 mb-2">Leave blank for no limit.</p>
                    <div className="input-field">
                        <i className="fas fa-rupee-sign" />
                        <input
                            type="number"
                            placeholder="Max Amount"
                            value={editLimitMember.newLimit || ''}
                            onChange={e => setEditLimitMember({ ...editLimitMember, newLimit: e.target.value })}
                        />
                    </div>
                    <button className="btn-primary mt-1" onClick={async () => {
                        const lim = editLimitMember.newLimit === '' || editLimitMember.newLimit === undefined
                            ? null
                            : parseFloat(editLimitMember.newLimit);
                        setIsLoading(true);
                        const res = await updateFamilyMember(token, editLimitMember.id, lim || 999999);
                        setIsLoading(false);
                        if (res.success) {
                            setMembers(members.map(m => m.id === editLimitMember.id ? { ...m, limit: lim } : m));
                            setModal(null);
                            setEditLimitMember(null);
                        } else {
                            alert(res.message || "Failed to update limit");
                        }
                    }}>Save Limit</button>
                </div>
            )}

        </div>
    );
}
