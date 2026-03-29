import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { sampleProducts } from "../lib/seedData";
import clientPromise from "../lib/mongo";

export default function Home({ products }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="mt-8 grid gap-8 rounded-3xl bg-brand-black p-10 text-white shadow-lg md:grid-cols-2">
        <div>
          <p className="uppercase tracking-widest text-gold text-sm">Luxury perfume boutique</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Experience allure in every drop</h1>
          <p className="mt-4 text-lg text-white/80">Explore curated blends of floral, oud, vanilla and ocean notes for a modern yet timeless presence.</p>
          <Link href="/products"><a className="mt-6 inline-block rounded-lg bg-gold px-6 py-3 font-semibold text-brand-black">Shop Perfumes</a></Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <div className="relative h-80 w-full rounded-xl overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1556228724-5a74a6440f86?auto=format&fit=crop&w=900&q=80" alt="perfume" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Products</h2>
          <Link href="/products"><a className="text-sm text-brand-black/70 hover:text-black">View all</a></Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(products.length ? products : sampleProducts).slice(0,4).map((product) => (
            <ProductCard key={product._id || product.name} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "mc-perfumery-db");
    const products = await db.collection("products").find({}).toArray();

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
      },
      revalidate: 60,
    };
  } catch (err) {
    console.error("Error loading products for home:", err);
    return {
      props: {
        products: sampleProducts,
      },
      revalidate: 60,
    };
  }
}
