import mysql from "mysql2/promise";

const conn = mysql.createPool({
  host: "viaduct.proxy.rlwy.net",
  port: "45390",
  database: "railway",
  user: "root",
  password: "AFa5h24DeCg2a-cF22gCECHAAADbgc-G",
});
export default conn;
