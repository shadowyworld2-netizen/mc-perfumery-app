import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { sampleProducts } from "../lib/seedData";
import clientPromise from "../lib/mongo";

export default function Home({ products }) {
  // Default home content
  const defaultHomeContent = {
    subtitle: "Luxury perfume boutique",
    title: "Experience allure in every drop",
    description: "Explore curated blends of floral, oud, vanilla and ocean notes for a modern yet timeless presence.",
    ctaText: "Shop Perfumes",
    heroImage: "https://images.unsplash.com/photo-1556228724-5a74a6440f86?auto=format&fit=crop&w=900&q=80",
    sectionTitle: "Featured Products",
    viewAllText: "View all"
  };

  // Get home content from localStorage or use defaults
  const getHomeContent = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("homeContent");
      return saved ? JSON.parse(saved) : defaultHomeContent;
    }
    return defaultHomeContent;
  };

  const homeContent = getHomeContent();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="mt-8 grid gap-8 rounded-3xl bg-brand-black p-10 text-white shadow-lg md:grid-cols-2">
        <div>
          <p className="uppercase tracking-widest text-gold text-sm">{homeContent.subtitle}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{homeContent.title}</h1>
          <p className="mt-4 text-lg text-white/80">{homeContent.description}</p>
          <Link href="/products"><a className="mt-6 inline-block rounded-lg bg-gold px-6 py-3 font-semibold text-brand-black">{homeContent.ctaText}</a></Link>
        </div>
        <div className="relative h-full min-h-[400px] w-full overflow-hidden">
          <img src={homeContent.heroImage} alt="perfume" className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{homeContent.sectionTitle}</h2>
          <Link href="/products"><a className="text-sm text-brand-black/70 hover:text-black">{homeContent.viewAllText}</a></Link>
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
