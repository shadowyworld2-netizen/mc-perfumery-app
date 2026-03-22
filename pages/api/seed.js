import clientPromise from "../../lib/mongo";
import { sampleProducts } from "../../lib/seedData";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const token = req.headers.authorization?.split(" ")[1];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "mc-perfumery-db");

  await db.collection("products").deleteMany({});
  const inserted = await db.collection("products").insertMany(sampleProducts);

  res.status(201).json({ inserted: inserted.insertedCount });
}
