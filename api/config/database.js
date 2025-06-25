const { Pool } = require("pg");

let globalPool = null;

// Initialize PostgreSQL Pool
async function initPool() {
  if (!globalPool) {
    console.log("⏳ Connecting to PostgreSQL...");
    globalPool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
    });

    // Test connection
    await globalPool.connect();
    console.log("✅ PostgreSQL connected.");
  }
  return globalPool;
}

class PDO {
  constructor() {
    this.pool = null;
  }

  async connect() {
    this.pool = await initPool();
  }

  /**
   * Execute raw SQL (only from PostgreSQL, no Redis)
   * @param {Object} options
   * @param {string} options.sqlQuery - SQL string to execute
   * @returns {Array} Query result rows
   */
  async execute({ sqlQuery = "" }) {
    if (!this.pool) {
      await this.connect();
    }

    console.log("🟡 Executing SQL query...");
    const result = await this.pool.query(sqlQuery);
    return result.rows;
  }
}

module.exports = PDO;
