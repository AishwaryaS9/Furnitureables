"use client";

import { useFilterStore } from "@/store/useFilterStore";

type Props = {
    totalPages: number;
};

export default function Pagination({
    totalPages,
}: Props) {

    const page = useFilterStore((s) => s.page);
    const setPage = useFilterStore((s) => s.setPage);

    return (
        <div className="flex justify-center gap-4 mt-10">

            <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Prev
            </button>

            <span className="px-4 py-2">
                {page} / {totalPages}
            </span>

            <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>

        </div>
    );
}