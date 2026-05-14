"use client";

// This runs immediately on the client before React hydrates.
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string") {
      const msg = args[0];
      if (
        msg.includes("A tree hydrated but some attributes of the server rendered HTML didn't match") ||
        msg.includes("Hydration failed because the initial UI does not match") ||
        msg.includes("Warning: Expected server HTML to contain a matching") ||
        msg.includes("bis_skin_checked") ||
        msg.includes("fdprocessedid")
      ) {
        // Silently ignore extension-injected hydration errors
        return;
      }
    }
    originalError.call(console, ...args);
  };
}

export function HydrationZapper() {
  return null;
}
