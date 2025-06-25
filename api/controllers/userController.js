const sql = require("mssql");
const PDO = require("../config/database");
const { generateToken } = require("../middlewares/auth");

// Get user by ID with Redis-cached SELECT query
exports.getUser = async (id) => {
  const pdo = new PDO();
  const data = await pdo.execute({
    key: `user:${id}`, // Redis key
    sqlQuery: `SELECT * FROM users WHERE id = '${id}'`,
    ttl: 120,
  });
  return data;
};

// Login user via stored procedure
exports.loginUser = async (username, password) => {
  const pdo = new PDO();

  const { data, output } = await pdo.callProcedure({
    procName: "sp_ui_login_user",
    inputParams: [
      { name: "username", type: sql.VarChar(50), value: username },
      { name: "password", type: sql.VarChar(50), value: password },
      { name: "PageNo", type: sql.Int, value: 1 },
      { name: "PageSize", type: sql.Int, value: 10 },
      { name: "Search", type: sql.VarChar(200), value: "" },
      { name: "user_id", type: sql.Int, value: 1 },
      { name: "company_id", type: sql.Int, value: 1 },
    ],
    outputParams: [
      { name: "StatusID", type: sql.Int },
      { name: "StatusMessage", type: sql.VarChar(200) },
      { name: "TotalCount", type: sql.Int },
    ],
  });

  if (output.StatusID == 1) {
    if (data[0]) {
      const token = generateToken(data[0]);
      return {
        user: data[0],
        token,
        status: output.StatusID,
        message: output.StatusMessage,
      };
    }
  }

  return {
    user: data[0] || null,
    status: output.StatusID,
    message: output.StatusMessage,
  };
};
