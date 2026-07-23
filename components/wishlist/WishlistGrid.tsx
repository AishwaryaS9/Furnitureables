import WishlistCard from "./WishlistCard";
import { WishlistItem } from "@/types/wishlist";

interface Props {
    wishlist: WishlistItem[];
}

export default function WishlistGrid({ wishlist }: Props) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item) => (
                <WishlistCard
                    key={item.id}
                    item={item}
                />
            ))}
        </div>
    );
}