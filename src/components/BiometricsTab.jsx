import React, { useState } from 'react';
import { addFamilyMember, deleteFamilyMember } from '../services/api';


export default function BiometricsTab({ members, setMembers, setModal, setEditLimitMember, token, setIsLoading }) {
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberLimit, setNewMemberLimit] = useState('');

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!newMemberName.trim()) return;
        const lim = newMemberLimit === '' ? null : parseFloat(newMemberLimit);
        
        setIsLoading(true);
        // Biometric backend expects a positive spending limit.
        const res = await addFamilyMember(token, newMemberName, lim || 999999);
        setIsLoading(false);

        if (res.success) {
            const m = res.familyMember;
            setMembers([...members, { id: m.id, name: m.name, limit: m.spendingLimit >= 900000 ? null : m.spendingLimit, isPrimary: false }]);
            setNewMemberName(''); 
            setNewMemberLimit('');
        } else {
            alert(res.message || "Failed to add member");
        }
    };

    const handleDeleteMember = async (id) => {
        setIsLoading(true);
        const res = await deleteFamilyMember(token, id);
        setIsLoading(false);

        if (res.success) {
            setMembers(members.filter(m => m.id !== id));
        } else {
            alert(res.message || "Failed to remove member");
        }
    };

    return (
        <div className="fade-in max-w-lg">
            <div className="card mb-2">
                <h3>Add New Biometric Member</h3>
                <form className="flex-row gap-1 mt-1" onSubmit={handleAddMember}>
                    <input
                        type="text" className="simple-input flex-1" placeholder="Member Name"
                        required value={newMemberName} onChange={e => setNewMemberName(e.target.value)}
                    />
                    <input
                        type="number" className="simple-input flex-1" placeholder="Limit (Optional)"
                        value={newMemberLimit} onChange={e => setNewMemberLimit(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '1rem 1.5rem' }}>Add</button>
                </form>
            </div>

            <div className="card">
                <h3>Authorized Members</h3>
                <div className="tx-list mt-1">
                    {members.map(m => (
                        <div key={m.id} className="member-item">
                            <div className="member-info">
                                <div className="tx-brand">{m.name} {m.isPrimary && <span className="badge">Main</span>}</div>
                                <div className="tx-details">Limit: {m.limit === null ? 'No Limit' : `₹${m.limit}`}</div>
                            </div>
                            <div className="member-actions">
                                {!m.isPrimary && (
                                    <>
                                        <button className="icon-btn edit-btn" onClick={() => {
                                            setEditLimitMember({ ...m, newLimit: m.limit !== null ? m.limit : '' });
                                            setModal('limit');
                                        }}>
                                            <i className="fas fa-edit" />
                                        </button>
                                        <button className="icon-btn del-btn" onClick={() => handleDeleteMember(m.id)}>
                                            <i className="fas fa-trash" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
