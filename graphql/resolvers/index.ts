import { productResolvers } from "./product";
import { cartResolver } from "./cart";
import { uploadResolver } from "./upload";
import { addressResolver } from "./address";

export const resolvers = {
    Query: {
        ...productResolvers.Query,
        ...cartResolver.Query,
        ...addressResolver.Query,
    },

    Mutation: {
        ...productResolvers.Mutation,
        ...cartResolver.Mutation,
        ...uploadResolver.Mutation,
        ...addressResolver.Mutation,
    },
};