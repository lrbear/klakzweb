"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Boxes, Code2, Compass, Search, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { categories, resources } from "@/lib/resources";

export default function Hub() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return resources.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const haystack = `${item.title} ${item.description} ${item.category} ${item.tags.join(" ")}`.toLowerCase();
      return matchesCategory && haystack.includes(normalized);
    });
  }, [query, category]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 pb-16 sm:px-8">
      <header className="flex h-20 items-center justify-between border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-300 text-zinc-950"><Boxes size={23} /></span>
          <span className="text-xl">KLAKZ<span className="text-lime-300">HUB</span></span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-400">
          <a href="#library" className="transition hover:text-white">Library</a>
          <Link href="/admin" className="rounded-lg border border-zinc-700 px-3 py-2 transition hover:border-lime-300 hover:text-lime-200">Admin demo</Link>
        </nav>
      </header>

      <section className="grid gap-10 py-16 md:grid-cols-[1.25fr_.75fr] md:items-center md:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs text-lime-200"><Sparkles size={14} /> YOUR DEVELOPER RESOURCE HUB</div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">Find your next <span className="text-lime-300">useful tool.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">Explore tools, code resources, templates and community projects in one clean library.</p>
          <a href="#library" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-3 font-bold text-zinc-950 transition hover:bg-lime-200">Explore library <ArrowUpRight size={18} /></a>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl shadow-black/20">
          <div className="mb-5 flex items-center justify-between"><span className="text-sm text-zinc-400">LIBRARY OVERVIEW</span><span className="h-2 w-2 rounded-full bg-lime-300" /></div>
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={<Code2 size={19} />} label="Resources" value={String(resources.length).padStart(2, "0")} />
            <Stat icon={<Compass size={19} />} label="Categories" value={String(categories.length - 1).padStart(2, "0")} />
            <Stat icon={<Wrench size={19} />} label="Tools & utilities" value="Explore" />
            <Stat icon={<ShieldCheck size={19} />} label="Curated library" value="Starter" />
          </div>
          <p className="mt-5 text-xs leading-5 text-zinc-500">Demo content is included so you can test the layout before adding your own resources.</p>
        </div>
      </section>

      <section id="library" className="scroll-mt-8">
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-xs font-bold tracking-[.2em] text-lime-300">THE COLLECTION</p><h2 className="text-3xl font-bold tracking-tight">Browse resources</h2><p className="mt-2 text-sm text-zinc-400">Search by name, category or tag.</p></div>
          <div className="relative w-full sm:max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources..." className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-lime-300" /></div>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-lg border px-3 py-2 text-sm transition ${category === item ? "border-lime-300 bg-lime-300 text-zinc-950" : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white"}`}>{item}</button>)}
        </div>
        {filtered.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => <Link href={`/library/${item.id}`} key={item.id} className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:-translate-y-1 hover:border-lime-300/60 hover:bg-zinc-900">
            <div className="mb-6 flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl border border-zinc-700 bg-zinc-950 text-lime-300"><Code2 size={21} /></span><ArrowUpRight className="text-zinc-600 transition group-hover:text-lime-300" size={19} /></div>
            <p className="text-xs font-semibold text-lime-300">{item.category}</p><h3 className="mt-2 text-lg font-bold">{item.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{item.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">#{tag}</span>)}</div>
          </Link>)}
        </div> : <div className="rounded-2xl border border-dashed border-zinc-800 py-16 text-center text-zinc-400">No resources found. Try another search.</div>}
      </section>
      <footer className="mt-20 border-t border-zinc-800 pt-6 text-sm text-zinc-500">© {new Date().getFullYear()} KLAKZHUB <span className="float-right">Built for curious developers.</span></footer>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"><div className="mb-5 text-lime-300">{icon}</div><p className="text-xs text-zinc-500">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>;
}
