"use client";

import { useFilterStore } from "@/store/useFilterStore";

export default function Pagination() {
    const page = useFilterStore((s) => s.page);
    const setPage = useFilterStore((s) => s.setPage);

    return (
        <div className="flex justify-center gap-4 mt-10">
            <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border rounded"
            >
                Prev
            </button>

            <span className="px-4 py-2">{page}</span>

            <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border rounded"
            >
                Next
            </button>
        </div>
    );
}