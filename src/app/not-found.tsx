import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center px-5 text-center">
    <div><p className="text-sm font-bold text-lime-300">404</p><h1 className="mt-3 text-4xl font-black">Resource not found</h1><p className="mt-3 text-zinc-400">This item may have been moved or removed.</p><Link className="mt-6 inline-block rounded-xl bg-lime-300 px-5 py-3 font-bold text-zinc-950" href="/">Return home</Link></div>
  </main>;
}
