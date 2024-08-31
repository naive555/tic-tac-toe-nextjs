import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

import _ from "lodash";

export async function GET(req: NextRequest) {
  const promisePool = mysqlPool.promise();

  const [rows, fields] = await promisePool.query(`SELECT * FROM users;`);

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { name, email, image } = await req.json();

  const promisePool = mysqlPool.promise();

  const [rows, fields] = await promisePool.query(
    `SELECT * FROM users WHERE email = ?;`,
    [email]
  );

  const users = await NextResponse.json(rows).json();
  const user = await _.first(users);
  if (user) {
    return NextResponse.json({ success: true });
  }

  await promisePool.query(
    `INSERT INTO 
      users 
        (name, email, image, score, streak, created_at, updated_at) 
      VALUES 
        (?, ?, ?, ?, ?, current_timestamp, current_timestamp);`,
    [name, email, image, 0, 0]
  );

  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { email, score, streak } = await req.json();

  const promisePool = mysqlPool.promise();

  await promisePool.query(
    `UPDATE users SET score = score + ?, streak = streak + ? WHERE email = ?;`,
    [score, streak, email]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { email } = await req.json();

  const promisePool = mysqlPool.promise();

  await promisePool.query(`DELETE FROM players WHERE email = ?;`, [email]);

  return NextResponse.json({ success: true });
}
