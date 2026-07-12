import { productResolvers } from "./product";
import { cartResolver } from "./cart";
import { uploadResolver } from "./upload";

export const resolvers = {
    Query: {
        ...productResolvers.Query,
        ...cartResolver.Query,
    },

    Mutation: {
        ...productResolvers.Mutation,
        ...cartResolver.Mutation,
        ...uploadResolver.Mutation,
    },
};