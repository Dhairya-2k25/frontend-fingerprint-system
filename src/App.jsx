import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import {
  registerUser,
  loginUser,
  fetchUser,
  fetchWallet,
  depositMoney,
  fetchFamilyMembers,
} from './services/api.js';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── Members are now loaded from the backend directly ─────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Navigation ──
  const [view, setView] = useState('login');

  // ── Auth ──
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);

  // ── Loading/Error ──
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  
  // ── Roles ──
  const [authRole, setAuthRole] = useState('user');


  // ── Login form ──
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // ── Registration form ──
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  // ─── On mount: restore session ──────────────────────────────────────────────
  useEffect(() => {
    if (token) loadDashboard(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Load user + wallet from backend ────────────────────────────────────────
  const loadDashboard = useCallback(async (jwt) => {
    setIsLoading(true);
    setGlobalError('');
    setCurrentUser(null);
    setBalance(0);
    setTransactions([]);
    setMembers([]);

    try {
      const [userRes, walletRes, membersRes] = await Promise.all([
        fetchUser(jwt),
        fetchWallet(jwt),
        fetchFamilyMembers(jwt),
      ]);

      if (!userRes.success) { handleLogout(); return; }

      const user = userRes.user;
      setCurrentUser(user);
      setBalance(walletRes.balance ?? 0);
      setTransactions(Array.isArray(walletRes.transactions) ? walletRes.transactions : []);

      let loadedMembers = [{ id: 'primary', name: user.name || user.username, limit: null, isPrimary: true }];
      if (membersRes.success && membersRes.familyMembers) {
          const formatted = membersRes.familyMembers.map(m => ({
              id: m.id,
              name: m.name,
              limit: m.spendingLimit >= 900000 ? null : m.spendingLimit,
              isPrimary: false
          }));
          loadedMembers = [...loadedMembers, ...formatted];
      }
      setMembers(loadedMembers);


      setView('dashboard');
    } catch (e) {
      setGlobalError('Failed to load dashboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Refresh wallet ─────────────────────────────────────────────────────────
  const refreshWallet = useCallback(async () => {
    if (!token) return;
    const walletRes = await fetchWallet(token);
    if (walletRes.success) {
      setBalance(walletRes.balance);
      setTransactions(walletRes.transactions);
    }
  }, [token]);

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setBalance(0);
    setTransactions([]);
    setMembers([]);
    setView('login');
    setLoginEmail(''); setLoginPass(''); setLoginError('');
  };

  // ─── Login ──────────────────────────────────────────────────────────────────
  const submitLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    const res = await loginUser(loginEmail, loginPass, authRole);
    setIsLoading(false);
    if (!res.success || !res.token) {
      setLoginError(res.message || 'Invalid email or password');
      return;
    }
    const jwt = res.token;
    sessionStorage.setItem('token', jwt);
    setToken(jwt);
    await loadDashboard(jwt);
  };

  // ─── Registration ───────────────────────────────────────────────────────────
  const proceedToReg2 = (e) => {
    e.preventDefault();
    if (!regName.trim() || !validateEmail(regEmail) || !validatePhone(regPhone)) {
      setRegError('Please fill all fields correctly.');
      return;
    }
    setRegError('');
    setView('reg2');
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    if (!regUsername.trim() || !validatePassword(regPassword)) {
      setRegError('Username required. Password must be 8+ chars, start with a letter, and include numbers.');
      return;
    }
    setIsLoading(true);
    setRegError('');
    const res = await registerUser({
      username: regUsername,
      password: regPassword,
      email: regEmail,
      name: regName,
      phone: `+91 ${regPhone}`,
      role: authRole,
    });
    setIsLoading(false);
    if (!res.success) {
      setRegError(res.message || 'Registration failed. Please try again.');
      return;
    }
    setRegName(''); setRegEmail(''); setRegPhone('');
    setRegUsername(''); setRegPassword(''); setRegError('');
    setView('login');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app-root">
      <div className="bg-blobs">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      </div>

      {isLoading && view !== 'dashboard' && (
        <div className="spinner-overlay"><div className="spinner" /></div>
      )}

      {(view === 'login' || view === 'reg1' || view === 'reg2') && (
        <Auth
          view={view} setView={setView}
          loginEmail={loginEmail} setLoginEmail={setLoginEmail}
          loginPass={loginPass} setLoginPass={setLoginPass}
          loginError={loginError} setLoginError={setLoginError}
          submitLogin={submitLogin}
          regName={regName} setRegName={setRegName}
          regEmail={regEmail} setRegEmail={setRegEmail}
          regPhone={regPhone} setRegPhone={setRegPhone}
          regUsername={regUsername} setRegUsername={setRegUsername}
          regPassword={regPassword} setRegPassword={setRegPassword}
          regError={regError} setRegError={setRegError}
          proceedToReg2={proceedToReg2}
          submitRegistration={submitRegistration}
          isLoading={isLoading}
          authRole={authRole}
          setAuthRole={setAuthRole}
        />
      )}

      {view === 'dashboard' && currentUser && (
        <Dashboard
          currentUser={currentUser}
          token={token}
          balance={balance}
          transactions={transactions}
          members={members}
          setMembers={setMembers}
          refreshWallet={refreshWallet}
          handleLogout={handleLogout}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
}
