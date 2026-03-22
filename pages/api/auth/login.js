import clientPromise from "../../../lib/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(422).json({ error: "All fields required" });

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "mc-perfumery-db");

  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.status(200).json({ token, user: { name: user.name, email: user.email, role: user.role } });
}
