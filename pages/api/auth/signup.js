import clientPromise from "../../../lib/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(422).json({ error: "All fields required" });

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "mc-perfumery-db");

  const existing = await db.collection("users").findOne({ email });
  if (existing) return res.status(409).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const entry = { name, email, password: hashed, role: "customer", createdAt: new Date() };
  const result = await db.collection("users").insertOne(entry);
  const token = jwt.sign({ userId: result.insertedId, role: "customer" }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({ token, user: { name, email, role: "customer" } });
}
