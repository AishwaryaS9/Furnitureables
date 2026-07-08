import { GraphQLClient } from "graphql-request";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const graphqlClient = new GraphQLClient(
    `${baseUrl}/api/graphql`
);