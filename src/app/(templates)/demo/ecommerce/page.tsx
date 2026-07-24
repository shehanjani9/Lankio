"use client";

import { useEffect, useMemo, useState } from "react";

/* ============================================================================
   CYBERPULSE / LUXE — Dark Tech x High-End Fashion Store (Standalone Demo)
   Self-contained. No external imports beyond React. Pure Tailwind utility classes.
   ============================================================================ */

type Category = "All" | "Audio" | "Apparel" | "Wearables";

interface Product {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  tag?: string;
}

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Aeon Wireless Headset",
    category: "Audio",
    price: 429,
    rating: 4.9,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop",
    tag: "New Drop",
  },
  {
    id: "p2",
    name: "Nocturne Bomber Jacket",
    category: "Apparel",
    price: 640,
    rating: 4.8,
    reviews: 158,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "p3",
    name: "Pulse Chrono Band",
    category: "Wearables",
    price: 890,
    rating: 5.0,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    tag: "Limited",
  },
  {
    id: "p4",
    name: "Voidline Sneaker",
    category: "Apparel",
    price: 380,
    rating: 4.7,
    reviews: 421,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "p5",
    name: "Circuit Earbuds Pro",
    category: "Audio",
    price: 249,
    rating: 4.6,
    reviews: 587,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "p6",
    name: "Halo Smart Ring",
    category: "Wearables",
    price: 520,
    rating: 4.9,
    reviews: 74,
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop",
    tag: "New Drop",
  },
  {
    id: "p7",
    name: "Monochrome Trench",
    category: "Apparel",
    price: 720,
    rating: 4.8,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "p8",
    name: "Ion Studio Speaker",
    category: "Audio",
    price: 610,
    rating: 4.9,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1200&auto=format&fit=crop",
  },
];

const CATEGORIES: Category[] = ["All", "Audio", "Apparel", "Wearables"];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating) ? "fill-amber-400" : "fill-white/15"
          }`}
        >
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-white/50">{rating.toFixed(1)}</span>
    </div>
  );
}

function useCountdown(target: number) {
  const [remaining, setRemaining] = useState(Math.max(0, target - Date.now()));
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    h: String(Math.floor(totalSeconds / 3600) % 24).padStart(2, "0"),
    m: String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0"),
    s: String(totalSeconds % 60).padStart(2, "0"),
    d: String(Math.floor(totalSeconds / 86400)).padStart(2, "0"),
  };
}

interface CartItem extends Product {
  qty: number;
}

export default function EcommerceDemoPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const dropTarget = useMemo(() => Date.now() + 1000 * 60 * 60 * 26, []);
  const countdown = useCountdown(dropTarget);

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = promoApplied ? subtotal * 0.15 : 0;
  const total = subtotal - discount;
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  function applyPromo() {
    if (promo.trim().toUpperCase() === "PULSE15") {
      setPromoApplied(true);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#07070b] text-white antialiased selection:bg-fuchsia-500/30">
      {/* Ambient glow backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/20 blur-[140px]" />
        <div className="absolute top-1/3 right-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/15 blur-[140px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07070b]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
            <span className="text-sm font-semibold tracking-[0.2em]">
              CYBERPULSE <span className="text-white/40">/ LUXE</span>
            </span>
          </div>
          <nav className="hidden gap-8 text-sm text-white/60 md:flex">
            {["Shop", "Drops", "Journal", "Concierge"].map((n) => (
              <a key={n} href="#" className="transition hover:text-white">
                {n}
              </a>
            ))}
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm backdrop-blur transition hover:border-fuchsia-400/50 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current">
              <path
                d="M3 4h2l1.4 12.6a2 2 0 002 1.8h8.2a2 2 0 002-1.7L20 8H6"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            Cart
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-500 text-[10px] font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-medium text-fuchsia-300 shadow-[0_0_30px_-8px_rgba(217,70,239,0.7)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-fuchsia-400" />
              </span>
              2026 Collection Drop
            </div>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Wear the{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                signal.
              </span>
              <br />
              Own the frequency.
            </h1>
            <p className="mt-6 max-w-md text-base text-white/60">
              A curated fusion of engineered sound and future-tech apparel.
              Precision-built, limited by design.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex gap-2">
                {[
                  { v: countdown.d, l: "Days" },
                  { v: countdown.h, l: "Hrs" },
                  { v: countdown.m, l: "Min" },
                  { v: countdown.s, l: "Sec" },
                ].map((t) => (
                  <div
                    key={t.l}
                    className="w-16 rounded-xl border border-white/10 bg-white/5 py-2 text-center backdrop-blur"
                  >
                    <div className="text-xl font-bold tabular-nums">{t.v}</div>
                    <div className="text-[10px] uppercase tracking-wider text-white/40">
                      {t.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#shop"
                className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-7 py-3 text-sm font-semibold text-black shadow-[0_0_35px_-8px_rgba(217,70,239,0.8)] transition hover:brightness-110"
              >
                Shop the Drop
              </a>
              <a
                href="#shop"
                className="rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5"
              >
                View Lookbook
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-fuchsia-500/20 to-cyan-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop"
                alt="Featured product spotlight"
                className="h-[420px] w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Aeon Wireless Headset</p>
                    <p className="text-xs text-white/50">Spotlight of the drop</p>
                  </div>
                  <p className="text-lg font-bold">$429</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="shop" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Shop the Collection</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === c
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-fuchsia-400/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                {p.tag && (
                  <span className="absolute left-3 top-3 rounded-full bg-fuchsia-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                    {p.tag}
                  </span>
                )}
                <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                  ${p.price}
                </span>
                <button
                  onClick={() => addToCart(p)}
                  className="absolute bottom-3 left-3 right-3 translate-y-14 rounded-xl bg-white py-2 text-xs font-bold text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Quick Add
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wider text-white/40">
                  {p.category}
                </p>
                <h3 className="mt-1 text-sm font-semibold">{p.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <StarRow rating={p.rating} />
                  <span className="text-xs text-white/40">
                    {p.reviews} reviews
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-10 sm:grid-cols-3 sm:px-8">
          {[
            { t: "Free Global Express Shipping", d: "2–4 day delivery, everywhere." },
            { t: "24/7 Concierge", d: "Real humans, real fast, always on." },
            { t: "Encrypted Checkout", d: "Bank-grade security on every order." },
          ].map((x) => (
            <div key={x.t} className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.7)]" />
              <div>
                <p className="text-sm font-semibold">{x.t}</p>
                <p className="text-xs text-white/50">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${
          cartOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setCartOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
            cartOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md transform border-l border-white/10 bg-[#0b0b12] shadow-2xl transition-transform duration-300 ${
            cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h3 className="text-lg font-bold">Your Bag ({itemCount})</h3>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="mt-10 text-center text-sm text-white/40">
                  Your bag is empty. Add something from the drop.
                </p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-white/40">${item.price}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="h-6 w-6 rounded-full border border-white/15 text-xs hover:bg-white/10"
                          >
                            −
                          </button>
                          <span className="text-xs">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="h-6 w-6 rounded-full border border-white/15 text-xs hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">
                        ${(item.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="mb-3 flex gap-2">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Discount code (try PULSE15)"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:border-fuchsia-400/50"
                />
                <button
                  onClick={applyPromo}
                  className="rounded-lg border border-white/15 px-4 text-sm font-medium hover:bg-white/10"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="mb-2 text-xs text-emerald-400">
                  Promo applied — 15% off
                </p>
              )}
              <div className="space-y-1 text-sm text-white/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-${discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-base font-bold text-white">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-3 text-sm font-bold text-black transition hover:brightness-110">
                Checkout Securely
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
