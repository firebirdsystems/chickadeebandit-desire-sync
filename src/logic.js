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

/**
 * The line a failed write shows, from the error's status — never the hub's
 * text. "Try again" only where trying again can work. `found` is the caller's
 * re-read after a write that changed nothing (true: the row is still there).
 */
export function failureLine(e, { action, thing, found } = {}) {
  if (e?.forUser) return e.message;
  if (e?.code === "UNIQUE_CONSTRAINT" || /UNIQUE constraint failed/i.test(String(e?.message ?? ""))) return `That ${thing} already exists.`;
  if (e?.status === 403) return `You don’t have permission to ${action}.`;
  if (e?.status === 507) return "The household’s storage is full — free up space first.";
  if (e?.status === 429) return "Too many tries — wait a minute and try again.";
  if (found === false || (found === undefined && e?.status === 404)) return `This ${thing} has been removed.`;
  if (found === true) return `You don’t have permission to ${action}.`;
  if (e?.status === 409) return `This ${thing} was changed by someone else — check it first.`;
  return `Couldn’t ${action} — try again.`;
}

/**
 * The partner endpoints that act on a pairing answer 409 when it is no longer
 * mutual (the partner unpaired, chose someone else, or re-paired): retrying
 * cannot work until the pairing is set again. Everything else is the table.
 */
export function pairedFailureLine(e, words) {
  if (e?.status === 409) return "You’re no longer paired with your partner — check your partner setting.";
  return failureLine(e, words);
}
