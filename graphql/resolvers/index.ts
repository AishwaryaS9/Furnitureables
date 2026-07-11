import { productResolver } from "./product";
import { cartResolver } from "./cart";
import { uploadResolver } from "./upload";

export const resolvers = {
    Query: {
        ...productResolver.Query,
        ...cartResolver.Query,
    },

    Mutation: {
        ...cartResolver.Mutation,
        ...uploadResolver.Mutation,
    },
};