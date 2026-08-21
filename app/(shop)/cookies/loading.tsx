import LegalPageSkeleton from "@/components/legal/LegalPageSkeleton";

export default function CookiesLoading() {
    return (
        <>
            <span className="sr-only">Loading Cookie Preferences...</span>
            <LegalPageSkeleton />
        </>
    );
}