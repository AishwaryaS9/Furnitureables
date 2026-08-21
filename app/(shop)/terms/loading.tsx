import LegalPageSkeleton from "@/components/legal/LegalPageSkeleton";

export default function TermsLoading() {
    return (
        <>
            <span className="sr-only">Loading Terms of Service...</span>
            <LegalPageSkeleton />
        </>
    );
}