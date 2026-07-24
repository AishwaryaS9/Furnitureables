import { CartItem, ServerCartItem } from "@/types/cart";

export function mapServerCartItem(item: ServerCartItem): CartItem {
    return {
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.media[0]?.url,
        quantity: item.quantity,
    };
}