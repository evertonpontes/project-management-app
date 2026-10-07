"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Custom hook to track whether a CSS media query matches.
 * Uses `useSyncExternalStore` for safe Next.js SSR and React 19 hydration without tearing.
 *
 * @param query The CSS media query string to match against (e.g. `(max-width: 768px)`).
 * @param defaultValue Fallback value used during SSR (defaults to `false`).
 * @returns A boolean indicating whether the media query matches.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
    const subscribe = useCallback(
        (callback: () => void) => {
            if (typeof window === "undefined" || !("matchMedia" in window)) {
                return () => {};
            }

            const mediaQueryList = window.matchMedia(query);
            mediaQueryList.addEventListener("change", callback);

            return () => {
                mediaQueryList.removeEventListener("change", callback);
            };
        },
        [query]
    );

    const getSnapshot = useCallback(() => {
        if (typeof window === "undefined" || !("matchMedia" in window)) {
            return defaultValue;
        }

        return window.matchMedia(query).matches;
    }, [query, defaultValue]);

    const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useMediaQuery;
