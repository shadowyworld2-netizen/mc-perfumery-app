import clientPromise from "../../lib/mongo";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });
    return res.status(200).json({ 
      status: "ok",
      mongodb: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Health check error:", err);
    return res.status(500).json({ 
      status: "error",
      mongodb: "failed",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
}
