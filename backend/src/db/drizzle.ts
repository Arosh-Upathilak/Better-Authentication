import { drizzle } from "drizzle-orm/mysql2";
import { config } from "../config/env";

export const db = drizzle(config.DATABASE_URL!);
