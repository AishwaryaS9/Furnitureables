import LegalPageSkeleton from "@/components/legal/LegalPageSkeleton";

export default function PrivacyLoading() {
    return (
        <>
            <span className="sr-only">Loading Privacy Policy...</span>
            <LegalPageSkeleton />
        </>
    );
}