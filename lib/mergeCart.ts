export type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
};

export function mergeCart(
    local: CartItem[],
    remote: CartItem[]
): CartItem[] {

    const map = new Map<string, CartItem>();

    remote.forEach(item => {
        map.set(item.id, item);
    });

    local.forEach(item => {

        const existing = map.get(item.id);

        if (existing) {

            existing.quantity += item.quantity;

        } else {

            map.set(item.id, item);

        }

    });

    return [...map.values()];
}