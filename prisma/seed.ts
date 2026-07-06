import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    // skipDuplicates: true,
    data: [
      {
        title: "Modern Sofa",
        description:
          "A stylish three-seater sofa upholstered in premium fabric, designed for comfort and modern living spaces.",
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
        description:
          "Ergonomic office chair with adjustable height, lumbar support, and a durable metal frame for long working hours.",
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
      {
        title: "Dining Table",
        description:
          "Elegant wooden dining table that comfortably seats six people, perfect for family meals and gatherings.",
        price: 599,
        stock: 7,
        image: "/images/dining-table.jpg",
        type: "table",
        material: "wood",
        color: "brown",
        room: "dining",
        dimensions: "180x90x75",
        sku: "TB01",
      },
      {
        title: "King Size Bed",
        description:
          "Spacious king-size bed crafted from solid wood, featuring a sturdy frame and contemporary headboard design.",
        price: 999,
        stock: 4,
        image: "/images/bed.jpg",
        type: "bed",
        material: "wood",
        color: "walnut",
        room: "bedroom",
        dimensions: "210x180x100",
        sku: "BD01",
      },
      {
        title: "Bookshelf",
        description:
          "Tall wooden bookshelf with multiple shelves, ideal for organizing books, decor pieces, and office essentials.",
        price: 349,
        stock: 8,
        image: "/images/bookshelf.jpg",
        type: "storage",
        material: "wood",
        color: "oak",
        room: "study",
        dimensions: "80x35x180",
        sku: "BS01",
      },
      {
        title: "Coffee Table",
        description:
          "Minimalist coffee table with a natural wood finish, adding warmth and functionality to any living room.",
        price: 249,
        stock: 12,
        image: "/images/coffee-table.jpg",
        type: "table",
        material: "wood",
        color: "natural",
        room: "living",
        dimensions: "120x60x45",
        sku: "CT01",
      },
      {
        title: "TV Stand",
        description:
          "Modern TV stand with spacious compartments and sleek lines, suitable for televisions up to 65 inches.",
        price: 399,
        stock: 6,
        image: "/images/tv-stand.jpg",
        type: "storage",
        material: "wood",
        color: "black",
        room: "living",
        dimensions: "160x40x55",
        sku: "TV01",
      },
      {
        title: "Wardrobe",
        description:
          "Large wardrobe featuring ample storage space, hanging sections, and shelves for organizing clothing efficiently.",
        price: 1199,
        stock: 3,
        image: "/images/wardrobe.jpg",
        type: "storage",
        material: "wood",
        color: "white",
        room: "bedroom",
        dimensions: "200x60x220",
        sku: "WR01",
      },
      {
        title: "Recliner Chair",
        description:
          "Luxurious leather recliner chair designed for maximum comfort, perfect for relaxation and entertainment areas.",
        price: 549,
        stock: 5,
        image: "/images/recliner.jpg",
        type: "chair",
        material: "leather",
        color: "brown",
        room: "living",
        dimensions: "90x95x105",
        sku: "RC01",
      },
      {
        title: "Study Desk",
        description:
          "Contemporary study desk with a spacious work surface, ideal for home offices, study rooms, and creative spaces.",
        price: 429,
        stock: 9,
        image: "/images/study-desk.jpg",
        type: "desk",
        material: "wood",
        color: "oak",
        room: "office",
        dimensions: "140x70x75",
        sku: "SD01",
      },
    ]
  });

  console.log("✅ Seed data inserted successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });