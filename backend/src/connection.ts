import 'dotenv/config';
import postgres from 'pg';

const client = new postgres.Client({
  connectionString: process.env.PGURI,
});

client.connect();

export default client;
