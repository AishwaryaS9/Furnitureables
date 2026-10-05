// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "@/hooks/useDebounce";

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

describe("useDebounce", () => {
    it("returns the first value straight away", () => {
        const { result } = renderHook(() => useDebounce("a"));

        expect(result.current).toBe("a");
    });

    it("waits 350 ms by default before showing a new value", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
            initialProps: { value: "a" },
        });

        rerender({ value: "b" });
        advance(349);
        expect(result.current).toBe("a");

        advance(1);
        expect(result.current).toBe("b");
    });

    it("uses a custom delay", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 1000), {
            initialProps: { value: "a" },
        });

        rerender({ value: "b" });
        advance(999);
        expect(result.current).toBe("a");

        advance(1);
        expect(result.current).toBe("b");
    });

    it("restarts the wait on every change and only keeps the last value", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: "s" },
        });

        rerender({ value: "so" });
        advance(200);
        rerender({ value: "sof" });
        advance(200);
        rerender({ value: "sofa" });
        advance(299);

        expect(result.current).toBe("s");

        advance(1);

        expect(result.current).toBe("sofa");
    });

    it("works with non-string values", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
            initialProps: { value: { page: 1 } },
        });

        rerender({ value: { page: 2 } });
        advance(100);

        expect(result.current).toEqual({ page: 2 });
    });

    it("does not leave a timer running after unmount", () => {
        const { rerender, unmount } = renderHook(({ value }) => useDebounce(value), {
            initialProps: { value: "a" },
        });

        rerender({ value: "b" });
        unmount();

        expect(vi.getTimerCount()).toBe(0);
    });
});
