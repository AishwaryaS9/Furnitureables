// import "dotenv/config";
// import { defineConfig } from "prisma/config";
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   adapter: new PrismaPg(pool),
// });

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: env("DIRECT_URL"),
    },
});