import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

import _ from "lodash";

export type User = {
  id: number;
  email: string;
  name: string;
  image: string;
  score: number;
  streak: number;
  created_at: Date;
  updated_at: Date;
};

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  const promisePool = mysqlPool.promise();

  const [users] = await promisePool.query(
    `SELECT * FROM users ${!email ? `;` : `WHERE email = ?;`}`,
    [email]
  );

  return NextResponse.json(users as User[]);
}

export async function POST(req: NextRequest) {
  const { name, email, image } = await req.json();

  const promisePool = mysqlPool.promise();

  const [users] = await promisePool.query(
    `SELECT * FROM users WHERE email = ?;`,
    [email]
  );

  const user = _.first(users as User[]);
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
    `UPDATE users SET score = ?, streak = ? WHERE email = ?;`,
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
