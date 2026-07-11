import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/index";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.product.createMany({
    skipDuplicates: true,
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
      {
        title: "Accent Armchair",
        description:
          "Comfortable accent armchair with soft cushioning and elegant wooden legs, ideal for reading corners and living spaces.",
        price: 329,
        stock: 7,
        image: "/images/armchair.jpg",
        type: "chair",
        material: "fabric",
        color: "beige",
        room: "living",
        dimensions: "85x80x95",
        sku: "AC01",
      },
      {
        title: "Nightstand",
        description:
          "Compact bedside nightstand with two drawers, providing convenient storage for books, lamps, and essentials.",
        price: 179,
        stock: 11,
        image: "/images/nightstand.jpg",
        type: "storage",
        material: "wood",
        color: "white",
        room: "bedroom",
        dimensions: "50x40x55",
        sku: "NS01",
      },
      {
        title: "Console Table",
        description:
          "Slim console table featuring a modern design, perfect for hallways, entryways, or decorative displays.",
        price: 289,
        stock: 6,
        image: "/images/console-table.jpg",
        type: "table",
        material: "wood",
        color: "walnut",
        room: "living",
        dimensions: "120x35x80",
        sku: "CN01",
      },
      {
        title: "Bar Stool",
        description:
          "Stylish bar stool with a sturdy metal frame and padded seat, suitable for kitchen islands and home bars.",
        price: 149,
        stock: 14,
        image: "/images/bar-stool.jpg",
        type: "chair",
        material: "metal",
        color: "grey",
        room: "dining",
        dimensions: "45x45x75",
        sku: "BS02",
      },
      {
        title: "Chest of Drawers",
        description:
          "Spacious chest of drawers with a sleek finish, offering ample storage for clothing, accessories, and linens.",
        price: 649,
        stock: 5,
        image: "/images/chest-drawers.jpg",
        type: "storage",
        material: "wood",
        color: "oak",
        room: "bedroom",
        dimensions: "120x50x90",
        sku: "CD01",
      },
      {
        title: "Outdoor Bench",
        description:
          "Durable outdoor bench crafted from weather-resistant wood, ideal for patios, gardens, and balconies.",
        price: 379,
        stock: 8,
        image: "/images/outdoor-bench.jpg",
        type: "bench",
        material: "wood",
        color: "teak",
        room: "outdoor",
        dimensions: "150x60x85",
        sku: "OB01",
      },
      {
        title: "Lounge Sofa",
        description:
          "Premium L-shaped lounge sofa with plush cushions and a contemporary design, perfect for spacious living rooms.",
        price: 1299,
        stock: 4,
        image: "/images/lounge-sofa.jpg",
        type: "sofa",
        material: "fabric",
        color: "navy",
        room: "living",
        dimensions: "280x170x85",
        sku: "SF02",
      },
      {
        title: "Kitchen Island",
        description:
          "Functional kitchen island featuring a durable wooden top, built-in storage shelves, and a modern aesthetic.",
        price: 749,
        stock: 5,
        image: "/images/kitchen-island.jpg",
        type: "table",
        material: "wood",
        color: "white",
        room: "kitchen",
        dimensions: "150x80x90",
        sku: "KI01",
      },
      {
        title: "Shoe Cabinet",
        description:
          "Elegant shoe cabinet with multiple compartments, designed to keep entryways organized and clutter-free.",
        price: 299,
        stock: 9,
        image: "/images/shoe-cabinet.jpg",
        type: "storage",
        material: "wood",
        color: "oak",
        room: "entryway",
        dimensions: "100x35x120",
        sku: "SC01",
      },
      {
        title: "Gaming Desk",
        description:
          "Modern gaming desk with a spacious surface, cable management features, and a sturdy metal frame for immersive setups.",
        price: 499,
        stock: 6,
        image: "/images/gaming-desk.jpg",
        type: "desk",
        material: "metal",
        color: "black",
        room: "office",
        dimensions: "160x75x75",
        sku: "GD01",
      },
      {
        title: "Round Dining Chair",
        description:
          "Elegant upholstered dining chair with a curved backrest and solid wooden legs, providing comfort and style for modern dining spaces.",
        price: 229,
        stock: 10,
        image: "/images/round-dining-chair.jpg",
        type: "chair",
        material: "fabric",
        color: "cream",
        room: "dining",
        dimensions: "55x60x85",
        sku: "CH02",
      },
      {
        title: "Floating Wall Shelf",
        description:
          "Minimalist floating wall shelf crafted from solid oak, perfect for displaying books, plants, and decorative items.",
        price: 99,
        stock: 20,
        image: "/images/wall-shelf.jpg",
        type: "storage",
        material: "wood",
        color: "oak",
        room: "living",
        dimensions: "100x25x5",
        sku: "WS01",
      },
      {
        title: "Queen Size Bed",
        description:
          "Modern queen-size bed with a durable wooden frame and padded headboard, designed for both comfort and elegance.",
        price: 849,
        stock: 6,
        image: "/images/queen-bed.jpg",
        type: "bed",
        material: "wood",
        color: "grey",
        room: "bedroom",
        dimensions: "205x160x110",
        sku: "BD02",
      },
      {
        title: "Coffee Bar Cabinet",
        description:
          "Versatile coffee bar cabinet with drawers, shelves, and a spacious countertop for organizing coffee essentials and kitchen accessories.",
        price: 459,
        stock: 7,
        image: "/images/coffee-bar-cabinet.jpg",
        type: "storage",
        material: "wood",
        color: "walnut",
        room: "kitchen",
        dimensions: "120x45x90",
        sku: "CB01",
      },
      {
        title: "Patio Dining Set",
        description:
          "Weather-resistant outdoor dining set including a table and four chairs, ideal for patios, gardens, and outdoor gatherings.",
        price: 999,
        stock: 4,
        image: "/images/patio-dining-set.jpg",
        type: "table",
        material: "metal",
        color: "charcoal",
        room: "outdoor",
        dimensions: "150x90x75",
        sku: "PD01",
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