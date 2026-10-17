import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function AdminDemoPage() {
  return <main className="mx-auto min-h-screen max-w-2xl px-5 py-12">
    <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-lime-300"><ArrowLeft size={16} /> Back to KLAKZHUB</Link>
    <section className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-7 sm:p-10">
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-zinc-700 bg-zinc-950 text-lime-300"><LockKeyhole size={23} /></div>
      <h1 className="mt-6 text-3xl font-black">Admin panel preview</h1>
      <p className="mt-3 leading-7 text-zinc-400">This page is a placeholder to plan the future admin area. It does not authenticate users and does not save changes.</p>
      <div className="mt-7 rounded-xl border border-amber-900/60 bg-amber-950/20 p-4 text-sm leading-6 text-amber-200">Do not treat this page as a secure admin panel. Before making it public, add server-side authentication, role checks, input validation and database storage.</div>
      <Link href="/" className="mt-7 inline-flex rounded-xl bg-lime-300 px-4 py-3 font-bold text-zinc-950">Open library</Link>
    </section>
  </main>;
}
