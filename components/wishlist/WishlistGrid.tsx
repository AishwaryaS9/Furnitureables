import WishlistCard from "./WishlistCard";
import { WishlistItem } from "@/types/wishlist";

interface Props {
    wishlist: WishlistItem[];
}

export default function WishlistGrid({ wishlist }: Props) {
    return (
        <div
            role="list"
            aria-label="Saved wishlist items"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 transition-all duration-300"
        >
            {wishlist.map((item) => (
                <div
                    key={item.id}
                    role="listitem"
                    className="group relative transition-transform duration-300 hover:-translate-y-1 focus-within:-translate-y-1 rounded-2xl"
                >
                    <WishlistCard item={item} />
                </div>
            ))}
        </div>
    );
}