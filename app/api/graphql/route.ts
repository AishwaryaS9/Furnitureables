import "dotenv/config";
import { createSchema, createYoga } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const typeDefs = /* GraphQL */ `
  type Product {
    id: String!
    title: String!
    price: Float!
    image: String
    type: String
    material: String
    createdAt: String!
  }

  input ProductFilterInput {
    type: String
    material: String
    minPrice: Float
    maxPrice: Float
  }

  type Query {
    products(filter: ProductFilterInput): [Product!]!
  }
`;

const resolvers = {
  Query: {
    products: async (_: any, args: any) => {
      const { filter } = args;

      const where: any = {};

      if (filter) {
        if (filter.type) {
          where.type = filter.type;
        }

        if (filter.material) {
          where.material = filter.material;
        }

        if (filter.minPrice || filter.maxPrice) {
          where.price = {};

          if (filter.minPrice) {
            where.price.gte = filter.minPrice;
          }

          if (filter.maxPrice) {
            where.price.lte = filter.maxPrice;
          }
        }
      }

      return await prisma.product.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
});

export { yoga as GET, yoga as POST };