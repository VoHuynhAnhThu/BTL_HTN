import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import axios from 'axios';

// In-memory fallback store must be declared BEFORE any storage access.
const memoryStore: Record<string, string> = {};

export const axiosInstance = axios.create({
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status <= 500,
});

// Attach token right before each request instead of at module init (avoids TDZ & stale token).
axiosInstance.interceptors.request.use((config) => {
    try {
        const token = getFromStorage('accessToken');
        if (token) {
            config.headers = config.headers || {};
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
    } catch {}
    return config;
});

export function processResponse<T>(response: any): CustomResponse<T> {
    // Axios response uses response.status; payload carries statusCode & message
    const payload = response?.data || {};
    return {
        success: (payload.statusCode || response.status) <= 299,
        message: ensureString(payload.message),
        data: payload.data,
        status: response.status,
    }
}

export function processError(error: any): CustomResponse<any> {
    // Normalize different axios error shapes to a string message
    let message: any = error;
    if (error?.response?.data?.message) message = error.response.data.message;
    else if (error?.message) message = error.message;
    else if (typeof error === 'object') message = JSON.stringify(error);
    return {
        success: false,
        message: ensureString(message),
        status: error?.response?.status || 500,
        data: null,
    };
}

function hasWebStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function saveToStorage(key: string, value: string) {
    try {
        if (Platform.OS === 'web' && hasWebStorage()) {
            window.localStorage.setItem(key, value);
        } else if (Platform.OS !== 'web') {
            SecureStore.setItem(key, value);
        } else {
            memoryStore[key] = value; // fallback for prerender
        }
    } catch (error) {
        console.error('Failed to save the data', error);
    }
}

export function getFromStorage(key: string) {
    try {
        if (Platform.OS === 'web' && hasWebStorage()) {
            const value = window.localStorage.getItem(key);
            return value ?? null;
        } else if (Platform.OS !== 'web') {
            const value = SecureStore.getItem(key);
            return value ?? null;
        }
        return memoryStore[key] ?? null;
    } catch (error) {
        console.error('Failed to retrieve the data', error);
        return null;
    }
}

// Ensure value is a short string (truncate long JSON for toast)
function ensureString(value: any): string {
    if (value == null) return "";
    if (typeof value === 'string') return value;
    try {
        const json = JSON.stringify(value);
        // Avoid extremely long messages in small toasts
        return json.length > 300 ? json.substring(0, 297) + '...' : json;
    } catch {
        return String(value);
    }
}