'use client'

import { useRef, useEffect } from "react";

/**
 * Custom hook to debounce a function
 * @param callback - The function to debounce
 * @param delay - The debounce delay in milliseconds
 */
export const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedFunction = (...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedFunction;
};
