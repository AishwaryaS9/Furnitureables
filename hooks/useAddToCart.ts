// // "use client";

// // import { useCartStore } from "@/store/cart";
// // import { Product } from "@/types/product";
// // import { getProductThumbnail } from "@/lib/utils";

// // export function useAddToCart() {
// //     const addToCart = useCartStore((s) => s.addToCart);

// //     return (product: Product, quantity = 1) => {
// //         addToCart({
// //             id: product.id,
// //             title: product.title,
// //             price: product.price,
// //             image: getProductThumbnail(product),
// //             quantity,
// //         });
// //     };
// // }



// "use client";

// import { Product } from "@/types/product";
// import { getProductThumbnail } from "@/lib/utils";
// import { useCartStore } from "@/store/cart";
// import { useServerAddToCart } from "./useServerAddToCart";
// import { useUser } from "@clerk/nextjs";

// export function useAddToCart() {
//     const { user } = useUser();

//     const guestAdd = useCartStore((s) => s.addToCart);

//     const serverAdd = useServerAddToCart();

//     return async (product: Product, quantity = 1) => {
//         if (!user) {
//             guestAdd({
//                 id: product.id,
//                 title: product.title,
//                 price: product.price,
//                 image: getProductThumbnail(product),
//                 quantity,
//             });

//             return;
//         }

//         await serverAdd.mutateAsync({
//             productId: product.id,
//             quantity,
//         });
//     };
// }


//latest code

"use client";

import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart";
import { Product } from "@/types/product";
import { getProductThumbnail } from "@/lib/utils";
import { useAddToCartMutation } from "./useAddToCartMutation";

// export function useAddToCart() {
//     const { user } = useUser();

//     const addGuest = useCartStore((s) => s.addToCart);

//     const addServer = useAddToCartMutation();

//     return (product: Product, quantity = 1) => {
//         if (!user) {
//             addGuest({
//                 id: product.id,
//                 title: product.title,
//                 price: product.price,
//                 image: getProductThumbnail(product),
//                 quantity,
//             });

//             return;
//         }

//         addServer.mutate({
//             productId: product.id,
//             quantity,
//         });
//     };
// }


export function useAddToCart() {
    const { user } = useUser();

    console.log("USER", user);

    const addGuest = useCartStore((s) => s.addToCart);

    const addServer = useAddToCartMutation();

    return (product: Product, quantity = 1) => {
        console.log("clicked");

        // if (!user) {
        //     console.log("guest cart");

        //     addGuest({
        //         id: product.id,
        //         title: product.title,
        //         price: product.price,
        //         image: getProductThumbnail(product),
        //         quantity,
        //     });

        //     console.log("add guest cart", addGuest)

        //     return;
        // }
        if (!user) {
            console.log("Guest cart");

            const guestCartItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                image: getProductThumbnail(product),
                quantity,
            };

            console.log("Adding to guest cart:", guestCartItem);

            addGuest(guestCartItem);

            return;
        }
        console.log("server cart");

        addServer.mutate({
            productId: product.id,
            quantity,
        });
    };
}