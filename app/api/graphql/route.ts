import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "@/graphql/schema";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

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

          if (filter.minPrice) {
            where.price.gte = filter.minPrice;
          }

          if (filter.maxPrice) {
            where.price.lte = filter.maxPrice;
          }
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
        skip: related ? undefined : (page - 1) * limit,
        take: related ? 4 : limit,
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

    cart: async () => {
      const user = await getCurrentUser();

      return prisma.cart.findUnique({
        where: {
          userId: user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    },
  },

  Mutation: {
    saveCart: async (_: any, { items }: any) => {
      const user = await getCurrentUser();

      let cart = await prisma.cart.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: user.id,
          },
        });
      }

      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      if (items.length > 0) {
        await prisma.cartItem.createMany({
          data: items.map((item: any) => ({
            cartId: cart!.id,
            productId: item.productId,
            quantity: item.quantity,
          })),
        });
      }

      return prisma.cart.findUnique({
        where: {
          id: cart.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
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
  fetchAPI: { Response },
});

export async function GET(request: Request) {
  return yoga.fetch(request);
}

export async function POST(request: Request) {
  return yoga.fetch(request);
}