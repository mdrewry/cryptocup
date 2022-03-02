import type { NextApiRequest, NextApiResponse } from "next";
import { db, auth } from "../../config/firebaseAdmin.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, month, day, year, wallet } = req.body;
  if (!email || !password) {
    res.status(500).json({ error: "Missing email or password." });
    return;
  }
  try {
    const user = await auth.createUser({
      email,
      password,
      emailVerified: false,
    });
    await db.collection("users").doc(user.uid).set({
      email,
      month,
      day,
      year,
      wallet
    });
  } catch (error) {
    res.status(500).json({ error });
    return;
  }

  res.status(200).json({ message: "User created successfully." });
}