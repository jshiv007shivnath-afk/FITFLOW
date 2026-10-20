import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');

async function runMigrations() {
  console.log('🚀 [FitFlow Migrations] Connecting to PostgreSQL at:', connectionString);
  const client = new pg.Client({ connectionString, connectionTimeoutMillis: 10000 });

  try {
    await client.connect();
    console.log('✅ Connected to database successfully.');

    if (!fs.existsSync(migrationsDir)) {
      console.error('❌ Migrations directory not found at:', migrationsDir);
      process.exit(1);
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${files.length} migration files in supabase/migrations.`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`⏳ Executing: ${file}...`);
      await client.query(sql);
      console.log(`✅ Applied: ${file}`);
    }

    console.log('🎉 [FitFlow Migrations] All schema migrations executed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
