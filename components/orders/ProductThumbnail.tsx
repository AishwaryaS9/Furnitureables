import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductThumbnailProps {
    image?: string | null;
    title: string;
    size?: "sm" | "md";
}

export default function ProductThumbnail({
    image,
    title,
    size = "sm",
}: ProductThumbnailProps) {
    const dimensions =
        size === "md"
            ? "h-20 w-20 sm:h-24 sm:w-24"
            : "h-12 w-12 sm:h-14 sm:w-14";

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg border bg-muted",
                dimensions
            )}
        >
            {image ? (
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 56px, 96px"
                    className="object-cover"
                />
            ) : (
                <div
                    role="img"
                    aria-label={`${title}, image not available`}
                    className="flex h-full items-center justify-center text-xs text-muted-foreground"
                >
                    <span aria-hidden="true">N/A</span>
                </div>
            )}
        </div>
    );
}