export const SIGNAL_WINDOW_HOURS = 3;

export function computeExpiry(now = new Date()) {
  return new Date(now.getTime() + SIGNAL_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
}

export function isSignalActive(expiresAt, now = new Date()) {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt);
  if (isNaN(expiry.getTime())) return false;
  return expiry.getTime() > now.getTime();
}

export function isMatch(mineExpiresAt, partnerExpiresAt, now = new Date()) {
  return isSignalActive(mineExpiresAt, now) && isSignalActive(partnerExpiresAt, now);
}

export function remainingMinutes(expiresAt, now = new Date()) {
  if (!isSignalActive(expiresAt, now)) return 0;
  return Math.ceil((new Date(expiresAt).getTime() - now.getTime()) / 60000);
}
