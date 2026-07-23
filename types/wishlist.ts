import { Product } from "./product";

export interface WishlistItem {
    id: string;
    createdAt: string;

    product: Product;
}

export interface WishlistResponse {
    wishlist: WishlistItem[];
}

export interface AddToWishlistResponse {
    addToWishlist: WishlistItem;
}

export interface RemoveFromWishlistResponse {
    removeFromWishlist: boolean;
}