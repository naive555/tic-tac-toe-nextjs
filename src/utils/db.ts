import mysql from "mysql2";

export const mysqlPool = mysql.createPool(process.env.MYSQL_URI as string);
