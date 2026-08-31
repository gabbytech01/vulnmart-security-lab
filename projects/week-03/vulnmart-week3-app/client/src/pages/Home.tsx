import { useMemo, useState } from "react";
import { ShieldCheck, ArrowUpRight, Boxes, FlaskConical, Activity, LockKeyhole, Search, Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(priceCents / 100);
}

export default function Home() {
  const { data: products, isLoading: productsLoading, isError: productsError } = trpc.catalogue.list.useQuery();
  const { data: health, isError: healthError } = trpc.health.useQuery();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(typeof products extends (infer T)[] | undefined ? T : never) | null>(null);
  const categories = useMemo(() => ["All", ...Array.from(new Set((products ?? []).map(product => product.category)))], [products]);
  const visibleProducts = useMemo(() => (products ?? []).filter(product => {
    const matchesCategory = category === "All" || product.category === category;
    const query = searchTerm.trim().toLowerCase();
    return matchesCategory && (!query || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query));
  }), [products, category, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-[#102b3a]">
      <header className="border-b border-[#dce7e8] bg-[#f4f7f8]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="/" className="flex items-center gap-3" aria-label="VulnMart home">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#0b3444] text-[#b8e5d3]"><ShieldCheck size={21} /></span>
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#178b78]">Security lab</span>
              <span className="block text-xl font-semibold tracking-tight text-[#102b3a]">VulnMart</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#55707a] md:flex">
            <a href="#catalogue" className="hover:text-[#102b3a]">Catalogue</a>
            <a href="#method" className="hover:text-[#102b3a]">How it works</a>
            <a href="#boundary" className="hover:text-[#102b3a]">Lab boundary</a>
            {isAuthenticated && <a href="/account" className="hover:text-[#102b3a]">Account</a>}
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-lg p-2 text-[#55707a] md:hidden" aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(open => !open)}>{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
            <span className="hidden items-center gap-2 rounded-full border border-[#cfe3dc] bg-[#eaf7f1] px-3 py-1.5 text-xs font-semibold text-[#17755f] sm:flex"><span className="size-1.5 rounded-full bg-[#22a579]" /> Local lab online</span>
            {isAuthenticated ? <button onClick={() => logout()} className="text-sm font-semibold text-[#55707a] hover:text-[#102b3a]">Sign out</button> : <span className="text-sm text-[#80939a]">Public preview</span>}
          </div>
        </div>
        {mobileMenuOpen && <nav className="border-t border-[#dce7e8] bg-white px-6 py-4 md:hidden"><div className="flex flex-col gap-4 text-sm font-semibold text-[#55707a]"><a href="#catalogue" onClick={() => setMobileMenuOpen(false)}>Catalogue</a><a href="#method" onClick={() => setMobileMenuOpen(false)}>How it works</a><a href="#boundary" onClick={() => setMobileMenuOpen(false)}>Lab boundary</a>{isAuthenticated && <a href="/account" onClick={() => setMobileMenuOpen(false)}>Account</a>}</div></nav>}
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-16 pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-10 lg:pb-24 lg:pt-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#cfe3dc] bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#17755f]"><FlaskConical size={14} /> A controlled e-commerce lab</div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#102b3a] sm:text-6xl lg:text-7xl">A storefront built to make security visible.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#5a7179]">VulnMart is a fictional catalogue for learning how modern applications are assembled, tested, fixed, and continuously improved.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><a href="#catalogue" className="inline-flex items-center gap-2 rounded-full bg-[#0b3444] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(11,52,68,0.18)] hover:bg-[#16485b]">Explore the catalogue <ArrowUpRight size={17} /></a><a href="#method" className="text-sm font-semibold text-[#17755f]">See the learning loop <span aria-hidden="true">→</span></a></div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#dce7e8] pt-6 text-sm text-[#6e838a]"><span className="flex items-center gap-2"><LockKeyhole size={16} className="text-[#178b78]" /> No real customer data</span><span className="flex items-center gap-2"><Activity size={16} className="text-[#178b78]" /> Test locally first</span></div>
          </div>
          <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] bg-[#d8efe7] p-6 sm:p-9">
            <div className="absolute -right-14 -top-16 size-64 rounded-full border-[28px] border-[#addbc8]/70" /><div className="absolute -bottom-24 -left-24 size-72 rounded-full border-[40px] border-[#b9e5d5]/60" />
            <div className="relative flex h-full min-h-[338px] flex-col justify-between rounded-[1.5rem] border border-white/70 bg-white/80 p-6 backdrop-blur-sm sm:p-8"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#17755f]">System note / 03</span><Boxes size={22} className="text-[#178b78]" /></div><div><p className="text-4xl font-semibold tracking-[-0.04em] text-[#102b3a]">Build with intent.</p><p className="mt-3 max-w-xs text-sm leading-6 text-[#637980]">Every feature becomes an opportunity to understand an asset, a boundary, and a security decision.</p></div><div className="grid grid-cols-3 gap-2 text-center text-xs font-medium text-[#55707a]"><div className="rounded-xl bg-[#eef8f3] px-2 py-3"><span className="block text-lg font-semibold text-[#17755f]">01</span>Build</div><div className="rounded-xl bg-[#f4f7f8] px-2 py-3"><span className="block text-lg font-semibold text-[#17755f]">02</span>Test</div><div className="rounded-xl bg-[#eef8f3] px-2 py-3"><span className="block text-lg font-semibold text-[#17755f]">03</span>Fix</div></div></div>
          </div>
        </section>

        <section id="catalogue" className="border-y border-[#dce7e8] bg-white"><div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#178b78]">Public catalogue</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#102b3a] sm:text-4xl">Fictional products. Real engineering lessons.</h2></div><p className="max-w-sm text-sm leading-6 text-[#6e838a]">No checkout or vulnerable functionality yet. This first release establishes clean boundaries for future work.</p></div><div className="mt-10">
              {!productsLoading && !productsError && products && products.length > 0 && <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><label className="relative block max-w-sm flex-1"><Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8ca0a4]" /><span className="sr-only">Search products</span><input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search the lab catalogue" className="w-full rounded-full border border-[#dce7e8] bg-[#fbfdfc] py-3 pl-11 pr-4 text-sm text-[#102b3a] outline-none placeholder:text-[#9aabad] focus:border-[#62b79d] focus:ring-2 focus:ring-[#d8efe7]" /></label><div className="flex flex-wrap gap-2" aria-label="Filter by category">{categories.map(item => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-3.5 py-2 text-xs font-semibold ${category === item ? "bg-[#0b3444] text-white" : "border border-[#dce7e8] bg-white text-[#55707a]"}`}>{item}</button>)}</div></div>}
              {productsError && <div className="rounded-2xl border border-[#f1d4c9] bg-[#fff7f3] px-5 py-4 text-sm text-[#9a503d]" role="alert">The catalogue could not be loaded. Refresh the page or check that the local API is running.</div>}
              {!productsLoading && !productsError && products?.length === 0 && <div className="rounded-2xl border border-dashed border-[#cbdcdb] bg-[#fbfdfc] px-5 py-10 text-center text-sm text-[#6e838a]">No active products are available in the lab catalogue yet.</div>}
              <div className="grid gap-5 md:grid-cols-3">{productsLoading ? [1, 2, 3].map(i => <div key={i} className="h-64 animate-pulse rounded-3xl bg-[#f1f5f5]" />) : visibleProducts.map(product => <article key={product.id} className="group flex min-h-64 flex-col justify-between rounded-3xl border border-[#dce7e8] bg-[#fbfdfc] p-6 transition-colors hover:border-[#9ecfc0]"><div><div className="flex items-center justify-between"><span className="rounded-full bg-[#eaf7f1] px-3 py-1 text-xs font-semibold text-[#17755f]">{product.category}</span><span className="text-xs font-medium text-[#91a1a5]">{String(product.id).padStart(2, "0")}</span></div><h3 className="mt-8 text-xl font-semibold tracking-tight text-[#102b3a]">{product.name}</h3><p className="mt-3 text-sm leading-6 text-[#6e838a]">{product.description}</p></div><div className="mt-8 flex items-center justify-between border-t border-[#e6eeee] pt-4"><span className="text-lg font-semibold text-[#102b3a]">{formatPrice(product.priceCents)}</span><span className="text-xs font-medium text-[#819399]">Lab inventory · {product.stockQuantity}</span><button type="button" onClick={() => setSelectedProduct(product)} className="mt-4 w-full border-t border-[#e6eeee] pt-4 text-left text-xs font-semibold text-[#17755f]">View lab brief <span aria-hidden="true">→</span></button></div></article>)}</div>{!productsLoading && !productsError && products && products.length > 0 && visibleProducts.length === 0 && <div className="mt-5 rounded-2xl border border-dashed border-[#cbdcdb] bg-[#fbfdfc] px-5 py-10 text-center text-sm text-[#6e838a]">No products match that search or category. Try clearing the filter.</div>}
            </div></div></section>

        <section id="method" className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.75fr_1.25fr] lg:px-10 lg:py-24"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#178b78]">The learning loop</p><h2 className="mt-3 max-w-md text-3xl font-semibold tracking-[-0.03em] text-[#102b3a] sm:text-4xl">A product foundation for security engineering.</h2><p className="mt-5 max-w-md text-base leading-7 text-[#6e838a]">This catalogue is intentionally small. It gives us a stable surface to add identity, orders, APIs, and security controls in later phases.</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-3xl bg-[#0b3444] p-6 text-white"><span className="text-sm font-semibold text-[#b8e5d3]">01 / Model</span><p className="mt-12 text-xl font-semibold">Understand the asset and its boundary.</p></div><div className="rounded-3xl border border-[#dce7e8] bg-white p-6"><span className="text-sm font-semibold text-[#178b78]">02 / Build</span><p className="mt-12 text-xl font-semibold text-[#102b3a]">Implement the smallest useful feature.</p></div><div className="rounded-3xl border border-[#dce7e8] bg-white p-6"><span className="text-sm font-semibold text-[#178b78]">03 / Verify</span><p className="mt-12 text-xl font-semibold text-[#102b3a]">Test behavior and document evidence.</p></div><div className="rounded-3xl bg-[#d8efe7] p-6"><span className="text-sm font-semibold text-[#17755f]">04 / Improve</span><p className="mt-12 text-xl font-semibold text-[#102b3a]">Fix the root cause and prevent regression.</p></div></div></section>

        <section id="boundary" className="bg-[#eaf7f1]"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-10"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#17755f]">Local-lab boundary</p><p className="mt-2 max-w-2xl text-sm leading-6 text-[#4c6b66]">VulnMart is fictional and designed for authorized education. It currently exposes only public catalogue data and no real payment, customer, or production systems.</p></div><div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#c5e2d6] bg-white/70 px-4 py-3 text-sm font-semibold text-[#17755f]"><span className={`size-2 rounded-full ${healthError ? "bg-[#c56b55]" : "bg-[#22a579]"}`} /> {healthError ? "Status unavailable" : health?.status === "ok" ? "Status verified" : "Checking status"}</div></div></section>
      </main>
      {selectedProduct && <div className="fixed inset-0 z-50 grid place-items-center bg-[#102b3a]/45 px-6" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedProduct(null); }}><section role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"><div className="flex items-start justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#178b78]">{selectedProduct.category}</p><h2 id="product-dialog-title" className="mt-2 text-2xl font-semibold text-[#102b3a]">{selectedProduct.name}</h2></div><button type="button" onClick={() => setSelectedProduct(null)} className="rounded-full p-2 text-[#55707a] hover:bg-[#f1f5f5]" aria-label="Close product details"><X size={20} /></button></div><p className="mt-6 leading-7 text-[#6e838a]">{selectedProduct.description}</p><div className="mt-7 flex items-center justify-between border-t border-[#e6eeee] pt-5"><span className="text-lg font-semibold text-[#102b3a]">{formatPrice(selectedProduct.priceCents)}</span><span className="text-sm text-[#819399]">Lab inventory · {selectedProduct.stockQuantity}</span></div><p className="mt-5 text-xs leading-5 text-[#91a1a5]">This is a read-only learning affordance. Checkout and order creation are intentionally out of scope for Week 3.</p></section></div>}
      <footer className="bg-[#0b3444] text-[#c5d8d8]"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-10"><span>VulnMart / Week 3 foundation</span><span className="text-[#86a6a5]">A controlled laboratory for application security engineering.</span></div></footer>
    </div>
  );
}
