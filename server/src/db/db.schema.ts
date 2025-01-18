const userTableSchema = `
CREATE TABLE IF NOT EXISTS users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email VARCHAR(255) UNIQUE NOT NULL,
username VARCHAR(255),
plan VARCHAR(50) DEFAULT 'free',
profile VARCHAR(255),
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
`;
const documentTableSchema = `
CREATE TABLE IF NOT EXISTS documents (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email VARCHAR(255) NOT NULL,
user_id UUID REFERENCES users(id),
file_name VARCHAR(255) NOT NULL,
file_size_bytes INTEGER NOT NULL,
pages INTEGER,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
`;
const usuageTableSchema = `
CREATE TABLE IF NOT EXISTS usuage (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id),
documents_count INTEGER DEFAULT 0,
total_pages INTEGER DEFAULT 0,
month INTEGER NOT NULL,
year INTEGER NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
UNIQUE(user_id, month, year)
)
`;
const chatsTableSchema = `
CREATE TABLE IF NOT EXISTS chats (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id),
document_id UUID REFERENCES documents(id),
question TEXT NOT NULL,
answer TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
`;
const embeddingTableSchema = `
CREATE TABLE IF NOT EXISTS document_embeddings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
document_id UUID REFERENCES documents(id),
content TEXT NOT NULL,
embedding vector(768),
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
`;

export const tableSQLQuery = {
  userTableSchema,
  documentTableSchema,
  usuageTableSchema,
  chatsTableSchema,
  embeddingTableSchema,
};
