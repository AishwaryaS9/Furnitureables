import "dotenv/config";
import { PrismaClient } from "@prisma/client/edge";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  await prisma.product.createMany({
    data: [
      {
        title: "Modern Sofa",
        price: 799,
        stock: 5,
        image: "/images/sofa.jpg",
        type: "sofa",
        material: "fabric",
        color: "grey",
        room: "living",
        dimensions: "200x90x80",
        sku: "SF01",
      },
      {
        title: "Office Chair",
        price: 199,
        stock: 10,
        image: "/images/chair.jpg",
        type: "chair",
        material: "metal",
        color: "black",
        room: "office",
        dimensions: "60x60x120",
        sku: "CH01",
      },
    ],
  });

  console.log("✅ Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });