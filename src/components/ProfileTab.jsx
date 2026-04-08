import React from 'react';

export default function ProfileTab({ currentUser }) {
    if (!currentUser) return null;

    return (
        <div className="fade-in max-w-lg">
            <div className="card text-center profile-card">
                <div className="profile-avatar"><i className="fas fa-user" /></div>
                <h2>{currentUser.name || currentUser.username}</h2>
                <div className="profile-details mt-2">
                    <div className="p-row"><span>Username</span> <strong>{currentUser.username}</strong></div>
                    <div className="p-row"><span>Email</span> <strong>{currentUser.email}</strong></div>
                    <div className="p-row"><span>Phone</span> <strong>{currentUser.phone || '—'}</strong></div>
                </div>
            </div>
        </div>
    );
}
