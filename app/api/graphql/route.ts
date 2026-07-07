import "dotenv/config";
import { createSchema, createYoga } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { typeDefs } from "@/graphql/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const resolvers = {
  Query: {
    products: async (_: any, args: any) => {
      const {
        filter,
        page = 1,
        limit = 8,
        related = false,
      } = args;

      const where: any = {};

      if (filter) {

        if (filter.category) {
          where.type = filter.category;
        }

        if (filter.room) {
          where.room = filter.room;
        }

        if (filter.material) {
          where.material = filter.material;
        }

        if (filter.search) {
          where.title = {
            contains: filter.search,
            mode: "insensitive",
          };
        }

        if (filter.minPrice || filter.maxPrice) {
          where.price = {};

          if (filter.minPrice)
            where.price.gte = filter.minPrice;

          if (filter.maxPrice)
            where.price.lte = filter.maxPrice;
        }

        if (filter.excludeId) {
          where.NOT = {
            id: filter.excludeId,
          };
        }
      }

      const total = await prisma.product.count({
        where,
      });

      let orderBy: any = {
        createdAt: "desc",
      };

      switch (filter?.sortBy) {
        case "priceAsc":
          orderBy = { price: "asc" };
          break;

        case "priceDesc":
          orderBy = { price: "desc" };
          break;

        case "nameAsc":
          orderBy = { title: "asc" };
          break;

        case "nameDesc":
          orderBy = { title: "desc" };
          break;

        default:
          orderBy = { createdAt: "desc" };
      }

      const items = await prisma.product.findMany({
        where,

        skip: related
          ? undefined
          : (page - 1) * limit,

        take: related
          ? 4
          : limit,

        orderBy,
      });

      return {
        items,
        total,
      };

    },


    product: async (_: any, { id }: any) => {
      return prisma.product.findUnique({
        where: { id },
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