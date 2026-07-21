import axios from 'axios';

// Base URL comes from an env var so this doesn't silently break the
// moment the app is deployed anywhere but localhost. Set VITE_API_URL in
// a .env file for other environments.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    // Sends/receives the httpOnly auth cookie the backend sets on
    // login/register — required for every request, not just login,
    // since that's how the backend recognizes the session.
    withCredentials: true,
});

export default api;
