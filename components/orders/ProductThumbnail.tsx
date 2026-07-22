import Image from "next/image";

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
            ? "h-24 w-24"
            : "h-12 w-12";

    return (
        <div
            className={`relative overflow-hidden rounded-lg border bg-muted ${dimensions}`}
        >
            {image ? (
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    N/A
                </div>
            )}
        </div>
    );
}