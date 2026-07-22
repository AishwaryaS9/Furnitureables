import { GraphQLClient } from "graphql-request";

// const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const graphqlClient = new GraphQLClient(
    `${baseUrl}/api/graphql`
);

