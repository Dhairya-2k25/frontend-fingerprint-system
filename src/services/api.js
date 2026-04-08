// src/services/api.js
// All API calls to the Express backend on port 3000

const BASE = "http://172.18.182.110:3000";

// ── Helper ────────────────────────────────────────────────────────────────────
const authHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 */
export const registerUser = async ({ username, password, email, name, phone, role }) => {
    try {
        const res = await fetch(`${BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email, name, phone, role }),
        });
        const data = await res.json();
        return { success: res.ok, message: data.message };
    } catch (e) {
        return { success: false, message: "Network error — is the backend running?" };
    }
};

/**
 * Login with email + password. Returns { success, token, message }.
 */
export const loginUser = async (email, password, role) => {
    try {
        const res = await fetch(`${BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role }),
        });
        const data = await res.json();
        return { success: res.ok, token: data.token || null, message: data.message };
    } catch (e) {
        return { success: false, message: "Network error — is the backend running?" };
    }
};

// ── User ──────────────────────────────────────────────────────────────────────

/**
 * Fetch the current user's profile. Returns { success, user }.
 */
export const fetchUser = async (token) => {
    try {
        const res = await fetch(`${BASE}/user`, {
            headers: authHeaders(token),
            cache: "no-store",
        });
        const data = await res.json();
        return { success: res.ok, user: data.user || null, message: data.message };
    } catch (e) {
        return { success: false, user: null, message: "Network error" };
    }
};

// ── Wallet ────────────────────────────────────────────────────────────────────

/**
 * Fetch wallet balance + transactions for the current user.
 * Returns { success, balance, transactions }.
 */
export const fetchWallet = async (token) => {
    try {
        const res = await fetch(`${BASE}/wallet`, {
            headers: authHeaders(token),
            cache: "no-store",
        });
        const data = await res.json();
        return {
            success: res.ok,
            balance: data.balance ?? 0,
            transactions: Array.isArray(data.transactions) ? data.transactions : [],
        };
    } catch (e) {
        return { success: false, balance: 0, transactions: [] };
    }
};

/**
 * Deposit money into the wallet.
 * Backend verifies password before proceeding.
 */
export const depositMoney = async (token, amount, password) => {
    try {
        const res = await fetch(`${BASE}/deposit`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify({ amount, password }),
        });
        const data = await res.json();
        return { success: res.ok, message: data.message, balance: data.balance };
    } catch (e) {
        return { success: false, message: "Network error" };
    }
};

// ── Family Members ────────────────────────────────────────────────────────────

/**
 * Fetch the current user's family members.
 * Returns { success, familyMembers }.
 */
export const fetchFamilyMembers = async (token) => {
    try {
        const res = await fetch(`${BASE}/family-members`, {
            headers: authHeaders(token),
            cache: "no-store",
        });
        const data = await res.json();
        return { success: res.ok, familyMembers: data.familyMembers || [] };
    } catch (e) {
        return { success: false, familyMembers: [] };
    }
};

/**
 * Add a new family member, which prompts for fingerprint via ESP32.
 * Returns { success, message, familyMember }.
 */
export const addFamilyMember = async (token, name, spendingLimit) => {
    try {
        const res = await fetch(`${BASE}/family-members`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify({ name, spendingLimit }),
        });
        const data = await res.json();
        return { success: res.ok, message: data.message, familyMember: data.familyMember };
    } catch (e) {
        return { success: false, message: "Network error" };
    }
};

/**
 * Update a family member limit.
 * Returns { success, message, familyMember }.
 */
export const updateFamilyMember = async (token, id, spendingLimit, resetSpent = false) => {
    try {
        const res = await fetch(`${BASE}/family-members/${id}`, {
            method: "PUT",
            headers: authHeaders(token),
            body: JSON.stringify({ spendingLimit, resetSpent }),
        });
        const data = await res.json();
        return { success: res.ok, message: data.message, familyMember: data.familyMember };
    } catch (e) {
        return { success: false, message: "Network error" };
    }
};

/**
 * Delete a family member.
 * Returns { success, message }.
 */
export const deleteFamilyMember = async (token, id) => {
    try {
        const res = await fetch(`${BASE}/family-members/${id}`, {
            method: "DELETE",
            headers: authHeaders(token),
        });
        const data = await res.json();
        return { success: res.ok, message: data.message };
    } catch (e) {
        return { success: false, message: "Network error" };
    }
};

/**
 * Initiate a payment transaction charging a user via fingerprint scanner.
 * Used by Merchant dashboard. Pings POST /transaction.
 */
export const makeTransaction = async (token, receiverId, amount) => {
    try {
        const res = await fetch(`${BASE}/transaction`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify({ receiverId, amount }),
        });
        const data = await res.json();
        console.log(res);
        return { success: res.ok, message: data.message };
    } catch (e) {
        return { success: false, message: "Network error during transaction" };
    }
};
