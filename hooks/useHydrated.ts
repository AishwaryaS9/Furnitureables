"use client";

import { useSyncExternalStore } from "react";
import type { UseQueryResult } from "@tanstack/react-query";

const subscribe = () => () => { };

export function useHydrated() {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );
}

export function useHydrationSafe<T extends UseQueryResult<any, any>>(query: T): T {
    const hydrated = useHydrated();
    if (hydrated) return query;

    return {
        ...query,
        data: undefined,
        error: null,
        isLoading: true,
        isPending: true,
        isFetching: true,
        isSuccess: false,
        isError: false,
        status: "pending",
    } as T;
}
