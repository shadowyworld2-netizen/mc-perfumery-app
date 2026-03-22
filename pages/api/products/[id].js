import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongo";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "mc-perfumery-db");
  const { id } = req.query;

  if (req.method === "GET") {
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ product });
  }

  if (req.method === "PUT") {
    const token = req.headers.authorization?.split(" ")[1];
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const updates = req.body;
    await db.collection("products").updateOne({ _id: new ObjectId(id) }, { $set: updates });
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    return res.status(200).json({ product });
  }

  if (req.method === "DELETE") {
    const token = req.headers.authorization?.split(" ")[1];
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
