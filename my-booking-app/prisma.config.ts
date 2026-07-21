import { defineConfig, env } from "prisma/config";
export default defineConfig({
  schema: "./schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:"mysql://root:2828@127.0.0.1:3306/booking",
  },
  },)