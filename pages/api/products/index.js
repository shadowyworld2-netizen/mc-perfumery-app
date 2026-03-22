import clientPromise from "../../../lib/mongo";
import { sampleProducts } from "../../../lib/seedData";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "mc-perfumery-db");

  if (req.method === "GET") {
    const products = await db.collection("products").find({}).toArray();
    return res.status(200).json({ products });
  }

  if (req.method === "POST") {
    const token = req.headers.authorization?.split(" ")[1];
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { name, price, category, description, image, stock } = req.body;
    if (!name || !price || !category) {
      return res.status(422).json({ error: "Missing required fields" });
    }
    const newProduct = { name, price, category, description, image, stock: stock ?? 0 };
    const result = await db.collection("products").insertOne(newProduct);
    return res.status(201).json({ product: { ...newProduct, _id: result.insertedId } });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
