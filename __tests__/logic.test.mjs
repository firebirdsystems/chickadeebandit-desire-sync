import { describe, it, expect } from "vitest";
import { SIGNAL_WINDOW_HOURS, computeExpiry, isSignalActive, isMatch, remainingMinutes } from "../src/logic.js";

const NOW = new Date("2026-01-01T12:00:00Z");

describe("computeExpiry", () => {
  it("returns an ISO timestamp exactly the signal window after now", () => {
    expect(computeExpiry(NOW)).toBe(new Date(NOW.getTime() + SIGNAL_WINDOW_HOURS * 3_600_000).toISOString());
  });
});

describe("isSignalActive", () => {
  it("is false for missing or unparsable values", () => {
    expect(isSignalActive(null, NOW)).toBe(false);
    expect(isSignalActive(undefined, NOW)).toBe(false);
    expect(isSignalActive("garbage", NOW)).toBe(false);
  });

  it("is false at or after expiry, true before", () => {
    expect(isSignalActive("2026-01-01T12:00:00Z", NOW)).toBe(false);
    expect(isSignalActive("2026-01-01T11:59:59Z", NOW)).toBe(false);
    expect(isSignalActive("2026-01-01T12:00:01Z", NOW)).toBe(true);
  });
});

describe("isMatch", () => {
  const active = "2026-01-01T14:00:00Z";
  const expired = "2026-01-01T11:00:00Z";

  it("requires both signals to be active", () => {
    expect(isMatch(active, active, NOW)).toBe(true);
    expect(isMatch(active, expired, NOW)).toBe(false);
    expect(isMatch(expired, active, NOW)).toBe(false);
    expect(isMatch(null, active, NOW)).toBe(false);
  });
});

describe("remainingMinutes", () => {
  it("is 0 for inactive signals", () => {
    expect(remainingMinutes("2026-01-01T11:00:00Z", NOW)).toBe(0);
    expect(remainingMinutes(null, NOW)).toBe(0);
  });

  it("rounds up to the next whole minute", () => {
    expect(remainingMinutes("2026-01-01T12:00:30Z", NOW)).toBe(1);
    expect(remainingMinutes("2026-01-01T12:01:00Z", NOW)).toBe(1);
    expect(remainingMinutes("2026-01-01T12:01:01Z", NOW)).toBe(2);
    expect(remainingMinutes("2026-01-01T15:00:00Z", NOW)).toBe(180);
  });
});
