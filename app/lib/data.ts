import { Pool } from "pg";

const globalForPg = global as unknown as { pgPool?: Pool };

const sslConfig = process.env.NODE_ENV === 'production' ? { 
  rejectUnauthorized: false
} : false;

export const pg =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { 
      rejectUnauthorized: false 
    } : false,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

if (!globalForPg.pgPool) globalForPg.pgPool = pg;