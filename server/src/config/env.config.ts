import dotenv from "dotenv";

dotenv.config();

export const config = {
  app: {
    port: process.env.PORT,
  },
  database: {
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
  auth: {
    googleClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiry: process.env.JWT_EXPIRY!,
  },
};
