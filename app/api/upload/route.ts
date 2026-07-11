import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const products = await request.json();

    let inserted = 0;
    let updated = 0;
    let failed = 0;

    const errors: string[] = [];

    for (const product of products) {
      try {
        const existing = await prisma.product.findUnique({
          where: {
            sku: product.sku,
          },
        });

        if (existing) {
          await prisma.product.update({
            where: {
              sku: product.sku,
            },
            data: {
              title: product.title,
              description: product.description,
              price: Number(product.price),
              stock: Number(product.stock),
              image: product.image,
              type: product.type,
              material: product.material,
              color: product.color,
              room: product.room,
              dimensions: product.dimensions,
            },
          });

          updated++;
        } else {
          await prisma.product.create({
            data: {
              ...product,
              price: Number(product.price),
              stock: Number(product.stock),
            },
          });

          inserted++;
        }
      } catch {
        failed++;
        errors.push(`SKU ${product.sku} could not be uploaded.`);
      }
    }

    return NextResponse.json({
      summary: {
        inserted,
        updated,
        failed,
      },
      errors,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}