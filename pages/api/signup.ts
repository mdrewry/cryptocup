import type { NextApiRequest, NextApiResponse } from "next";
import { db, auth } from "../../config/firebaseAdmin.config";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstName, lastName, email, password, birthdayStr } = req.body;
  const birthday = moment(birthdayStr, "M/D/YYYY");
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
      firstName,
      lastName,
      email,
      birthday,
      wallet: "",
      cupWins: 0, 
      cupsPlayed: 0, 
      headsUpPlayed: 0, 
      headsUpWins: 0, 
      totalEarnings: 0, 
      totalPercentGain: 0,
      walletVerified: false,
      newsPreferences: [],
      imageURL: "",
    });
  } catch (error) {
    res.status(500).json({ error });
    return;
  }

  res.status(200).json({ message: "User created successfully." });
}
