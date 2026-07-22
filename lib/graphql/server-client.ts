import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";

const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

export async function graphqlServerClient() {
    const cookieStore = await cookies();

    return new GraphQLClient(`${baseUrl}/api/graphql`, {
        headers: {
            cookie: cookieStore.toString(),
        },
    });
}