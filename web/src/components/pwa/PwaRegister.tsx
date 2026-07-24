"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Never keep a SW in development — cache-first HTML fights Next HMR and Clerk.
    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((r) => r.unregister())))
        .then(() => {
          if ("caches" in window) {
            return caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
          }
        })
        .catch(() => {
          /* optional */
        });
      return;
    }

    void navigator.serviceWorker.register("/sw.js").catch(() => {
      /* optional */
    });
  }, []);
  return null;
}
