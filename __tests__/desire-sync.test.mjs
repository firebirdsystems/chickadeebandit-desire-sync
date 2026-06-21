import { describe, it, expect } from "vitest";
import { SIGNAL_WINDOW_HOURS, computeExpiry, isSignalActive, isMatch, remainingMinutes } from "../src/logic.js";

const NOW = new Date("2026-06-07T12:00:00.000Z");
const hoursFromNow = (h) => new Date(NOW.getTime() + h * 60 * 60 * 1000).toISOString();

describe("computeExpiry", () => {
  it("returns an ISO timestamp SIGNAL_WINDOW_HOURS in the future", () => {
    const expiry = computeExpiry(NOW);
    expect(new Date(expiry).getTime() - NOW.getTime()).toBe(SIGNAL_WINDOW_HOURS * 60 * 60 * 1000);
  });
});

describe("isSignalActive", () => {
  it("is false for null/undefined", () => {
    expect(isSignalActive(null, NOW)).toBe(false);
    expect(isSignalActive(undefined, NOW)).toBe(false);
  });

  it("is false for an invalid date string", () => {
    expect(isSignalActive("not-a-date", NOW)).toBe(false);
  });

  it("is true when expiry is in the future", () => {
    expect(isSignalActive(hoursFromNow(1), NOW)).toBe(true);
  });

  it("is false when expiry is in the past", () => {
    expect(isSignalActive(hoursFromNow(-1), NOW)).toBe(false);
  });

  it("is false when expiry equals now", () => {
    expect(isSignalActive(NOW.toISOString(), NOW)).toBe(false);
  });
});

describe("isMatch", () => {
  it("is true when both signals are active", () => {
    expect(isMatch(hoursFromNow(1), hoursFromNow(2), NOW)).toBe(true);
  });

  it("is false when only mine is active", () => {
    expect(isMatch(hoursFromNow(1), hoursFromNow(-1), NOW)).toBe(false);
  });

  it("is false when only theirs is active", () => {
    expect(isMatch(hoursFromNow(-1), hoursFromNow(1), NOW)).toBe(false);
  });

  it("is false when neither is active", () => {
    expect(isMatch(hoursFromNow(-1), hoursFromNow(-2), NOW)).toBe(false);
  });

  it("is false when the partner has never signaled", () => {
    expect(isMatch(hoursFromNow(1), null, NOW)).toBe(false);
  });
});

describe("remainingMinutes", () => {
  it("returns 0 for an inactive signal", () => {
    expect(remainingMinutes(hoursFromNow(-1), NOW)).toBe(0);
    expect(remainingMinutes(null, NOW)).toBe(0);
  });

  it("rounds up to the nearest minute for an active signal", () => {
    const expiresAt = new Date(NOW.getTime() + 90 * 60 * 1000 + 30 * 1000).toISOString();
    expect(remainingMinutes(expiresAt, NOW)).toBe(91);
  });

  it("matches the full window right after activation", () => {
    expect(remainingMinutes(computeExpiry(NOW), NOW)).toBe(SIGNAL_WINDOW_HOURS * 60);
  });
});
