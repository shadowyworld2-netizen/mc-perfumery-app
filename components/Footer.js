export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} MC Perfumery — Crafted for luxury senses.</p>
      </div>
    </footer>
  );
}
