import { productResolvers } from "./product";
import { cartResolver } from "./cart";
import { uploadResolver } from "./upload";
import { addressResolver } from "./address";
import { orderResolver } from "./order";
import { wishlistResolver } from "./wishlist";
import { paymentResolver } from "./payment";
import { couponResolvers } from './coupon';
import { dashboardResolver } from "./dashboard";
import { customerResolver } from "./customer";
import { reviewResolver } from "./review";
import { analyticsResolver } from "./analytics";
import { notificationResolvers } from "./notification";

export const resolvers = {
    Query: {
        ...productResolvers.Query,
        ...cartResolver.Query,
        ...addressResolver.Query,
        ...orderResolver.Query,
        ...wishlistResolver.Query,
        ...couponResolvers.Query,
        ...dashboardResolver.Query,
        ...customerResolver.Query,
        ...reviewResolver.Query,
        ...analyticsResolver.Query,
        ...notificationResolvers.Query,
    },

    Mutation: {
        ...productResolvers.Mutation,
        ...cartResolver.Mutation,
        ...uploadResolver.Mutation,
        ...addressResolver.Mutation,
        ...orderResolver.Mutation,
        ...wishlistResolver.Mutation,
        ...paymentResolver.Mutation,
        ...reviewResolver.Mutation,
        ...couponResolvers.Mutation,
        ...notificationResolvers.Mutation,
    },
    Product: {
        ...productResolvers.Product
    }
};