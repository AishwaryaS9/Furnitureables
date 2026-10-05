// @vitest-environment jsdom
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { UseQueryResult } from "@tanstack/react-query";
import { useHydrationSafe } from "@/hooks/useHydrated";

const emptyQuery = {
    data: undefined,
    isLoading: true,
    isPending: true,
    isFetching: true,
    isSuccess: false,
    isError: false,
    error: null,
    status: "pending",
} as unknown as UseQueryResult<string[]>;

const cachedQuery = {
    data: ["sofa", "bed"],
    isLoading: false,
    isPending: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: null,
    status: "success",
} as unknown as UseQueryResult<string[]>;

let currentQuery = emptyQuery;

function Categories() {
    const { data, isLoading } = useHydrationSafe(currentQuery);

    if (isLoading) return <div role="status">Loading</div>;

    return (
        <ul>
            {(data ?? []).map((c) => (
                <li key={c}>{c}</li>
            ))}
        </ul>
    );
}

let container: HTMLDivElement | null = null;

afterEach(() => {
    currentQuery = emptyQuery;
    container?.remove();
    container = null;
    vi.restoreAllMocks();
});

describe("useHydrationSafe", () => {
    it("renders the loading state on the server even when data is cached", () => {
        currentQuery = cachedQuery;

        const html = renderToString(<Categories />);

        expect(html).toContain("Loading");
        expect(html).not.toContain("<li>");
    });

    it("hydrates server HTML without a mismatch, then shows the cached data", async () => {
        // 1. the server renders with an empty cache
        currentQuery = emptyQuery;
        const html = renderToString(<Categories />);
        expect(html).toContain("Loading");

        // 2. by hydration time the browser cache has data
        currentQuery = cachedQuery;

        container = document.createElement("div");
        container.innerHTML = html;
        document.body.appendChild(container);

        const onRecoverableError = vi.fn();
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => { });

        await act(async () => {
            hydrateRoot(container!, <Categories />, { onRecoverableError });
        });

        // no hydration mismatch was reported
        expect(onRecoverableError).not.toHaveBeenCalled();
        expect(consoleError).not.toHaveBeenCalled();

        // and the real (cached) data is on screen after hydration
        expect(container.querySelectorAll("li")).toHaveLength(2);
        expect(container.textContent).toContain("sofa");
        expect(container.querySelector('[role="status"]')).toBeNull();
    });
});
