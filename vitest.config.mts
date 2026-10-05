import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
    resolve: {
        // mirrors "paths": { "@/*": ["./*"] } in tsconfig.json
        alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
    },
    test: {
        environment: "node",

        maxWorkers: "50%",

        setupFiles: ["./vitest.setup.ts"],
        include: ["tests/unit/**/*.test.{ts,tsx}"],
        css: false,
        coverage: {
            provider: "v8",
            include: ["lib/**", "store/**", "hooks/**", "components/**"],
        },
    },
});