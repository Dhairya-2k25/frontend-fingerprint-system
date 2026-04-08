import React from 'react';

const validateEmail = (email) =>
    /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/i.test(email);

const validatePhone = (phone) => /^[6789]\d{9}$/.test(phone);

const validatePassword = (pwd) => {
    if (pwd.length < 8) return false;
    if (/^[0-9]/.test(pwd)) return false;
    if (!/[a-zA-Z]/.test(pwd)) return false;
    if (!/[0-9]/.test(pwd)) return false;
    return true;
};

export default function Auth({
    view,
    setView,
    loginEmail, setLoginEmail,
    loginPass, setLoginPass,
    loginError, setLoginError,
    submitLogin,
    regName, setRegName,
    regEmail, setRegEmail,
    regPhone, setRegPhone,
    regUsername, setRegUsername,
    regPassword, setRegPassword,
    regError, setRegError,
    proceedToReg2,
    submitRegistration,
    isLoading,
    authRole, setAuthRole
}) {

    const renderLogin = () => (
        <div className="auth-container">
            <div className="glass-card login-card">
                <div className="flex-row gap-1" style={{ marginBottom: '1rem' }}>
                    <button type="button" className={authRole === 'user' ? 'btn-primary flex-1' : 'btn-secondary flex-1'} onClick={() => setAuthRole('user')}>User</button>
                    <button type="button" className={authRole === 'merchant' ? 'btn-primary flex-1' : 'btn-secondary flex-1'} onClick={() => setAuthRole('merchant')}>Merchant</button>
                </div>
                <h2 className="title text-center">Sign In</h2>
                {loginError && <div className="error-box">{loginError}</div>}
                <form onSubmit={submitLogin}>
                    <div className="input-field">
                        <i className="fas fa-envelope" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={loginEmail}
                            onChange={e => setLoginEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-lock" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={loginPass}
                            onChange={e => setLoginPass(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Signing in…' : 'Login'}
                    </button>
                </form>
                <div className="auth-footer">
                    New user?{' '}
                    <span onClick={() => { setView('reg1'); setRegError(''); }}>New Registration</span>
                </div>
            </div>
        </div>
    );

    const renderReg1 = () => (
        <div className="auth-container">
            <div className="glass-card login-card">
                <div className="flex-row gap-1" style={{ marginBottom: '1rem' }}>
                    <button type="button" className={authRole === 'user' ? 'btn-primary flex-1' : 'btn-secondary flex-1'} onClick={() => setAuthRole('user')}>User</button>
                    <button type="button" className={authRole === 'merchant' ? 'btn-primary flex-1' : 'btn-secondary flex-1'} onClick={() => setAuthRole('merchant')}>Merchant</button>
                </div>
                <h2 className="title text-center">New Registration</h2>
                <p className="subtitle text-center">Step 1: Personal Info</p>
                {regError && <div className="error-box">{regError}</div>}
                <form onSubmit={proceedToReg2}>
                    <div className="input-field">
                        <i className="fas fa-user-circle" />
                        <input type="text" placeholder="Full Name" required value={regName} onChange={e => setRegName(e.target.value)} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-envelope" />
                        <input type="email" placeholder="Email Address" required value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                    </div>
                    <div className="input-field phone-field">
                        <span className="prefix">+91</span>
                        <input
                            type="tel" placeholder="Phone Number" required maxLength="10"
                            value={regPhone} onChange={e => setRegPhone(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Next</button>
                </form>
                <div className="auth-footer">
                    Already have an account?{' '}
                    <span onClick={() => { setView('login'); setRegError(''); }}>Sign In</span>
                </div>
            </div>
        </div>
    );

    const renderReg2 = () => (
        <div className="auth-container">
            <div className="glass-card login-card">
                <h2 className="title text-center">Account Setup</h2>
                <p className="subtitle text-center">Step 2: Credentials</p>
                {regError && <div className="error-box">{regError}</div>}
                <form onSubmit={submitRegistration}>
                    <div className="input-field">
                        <i className="fas fa-user" />
                        <input type="text" placeholder="Username" required value={regUsername} onChange={e => setRegUsername(e.target.value)} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-lock" />
                        <input type="password" placeholder="Password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                    </div>
                    <div className="flex-row gap-1">
                        <button type="button" className="btn-secondary flex-1" onClick={() => { setView('reg1'); setRegError(''); }}>Back</button>
                        <button type="submit" className="btn-primary flex-2" disabled={isLoading}>
                            {isLoading ? (authRole === 'merchant' ? 'Creating...' : 'Waiting for Fingerprint...') : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <>
            {view === 'login' && renderLogin()}
            {view === 'reg1' && renderReg1()}
            {view === 'reg2' && renderReg2()}
        </>
    );
}
