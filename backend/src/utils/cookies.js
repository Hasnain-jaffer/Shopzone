/**
 * httpOnly cookie helper for the auth token.
 *
 * WHY: previously the JWT was only ever returned in the JSON response
 * body, and the frontend stored it in localStorage to send back as an
 * Authorization header. Anything in localStorage is readable by any JS
 * running on the page — including an XSS payload — which would hand an
 * attacker a fully valid 7-day session token. Setting the token as an
 * httpOnly cookie means client-side JS (and XSS) can never read it; the
 * browser attaches it automatically on every request instead.
 *
 * authMiddleware still also accepts a Bearer header for flexibility
 * (e.g. a future mobile client that can't use cookies), but the website
 * frontend no longer needs to read or store the token at all.
 */
const COOKIE_NAME = 'token';
function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // requires HTTPS in production
    // 'none' is required (not 'strict') because the frontend (Vercel) and
    // backend (Render) live on different domains — that makes every
    // request cross-site, and browsers refuse to attach 'strict' or even
    // 'lax' cookies on cross-site requests. 'none' is the only setting
    // that allows the cookie cross-domain, and it requires `secure: true`
    // (already satisfied above) or browsers silently drop the cookie.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days, matches the JWT's own expiry
  };
}
function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}
function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
}
function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) return authHeader.split(' ')[1];
  return req.cookies?.[COOKIE_NAME] || null;
}
export { COOKIE_NAME, setAuthCookie, clearAuthCookie, getTokenFromRequest };