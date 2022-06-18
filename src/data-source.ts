import { DataSource } from "typeorm";
import { Card } from "./entities/card";
import { Image } from "./entities/image";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Card, Image],
  synchronize: true,
  ssl:
    process.env.NODE_ENV == "production"
      ? { rejectUnauthorized: false }
      : false,
});
