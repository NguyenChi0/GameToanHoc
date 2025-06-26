const mysql = require("mysql2");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "gametinhtoan",
});
conn.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL connected");
});
module.exports = conn;
