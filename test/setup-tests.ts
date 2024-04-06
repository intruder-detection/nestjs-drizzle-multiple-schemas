process.env.DB_USER = 'drizzle-orm';
process.env.DB_PASSWORD = 'pass';
process.env.DB_HOST_NAME = 'localhost';
process.env.DB_PORT = '5432'; // check test docker-compose
process.env.DB_NAME = 'drizzle-orm';
// Each schema will have their own unique identifier (test1, test2, etc), allowing each test data to be contained on their own schema.
process.env.DB_SCHEMA_NAME = `test${process.env.VITEST_POOL_ID}`;
