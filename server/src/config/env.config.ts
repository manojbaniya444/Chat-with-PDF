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
  log: {
    level: process.env.LOG_LEVEL,
  },
  azure: {
    storageKey: process.env.AZURE_STORAGE_KEY,
    storageConnection: process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName: process.env.AZURE_CONTAINER_NAME,
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  },
  embeddings: {
    providerName: process.env.LOCAL_EMBEDDING_PROVIDER,
    localEmbeddingDim: process.env.LOCAL_EMBEDDING_DIM,
  },
  localModel: {
    baseUrl: process.env.LOCAL_MODEL_BASE_URL,
  },
};
