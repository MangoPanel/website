import { Pool } from "pg";

const globalForPg = global as unknown as { pgPool?: Pool };

const sslConfig = process.env.NODE_ENV === 'production' ? { 
  rejectUnauthorized: false
} : false;

export const pg =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 60000,
    max: 30,
    min: 5,
  });

if (!globalForPg.pgPool) globalForPg.pgPool = pg;