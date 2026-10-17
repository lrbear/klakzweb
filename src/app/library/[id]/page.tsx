import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Code2 } from "lucide-react";
import { resources } from "@/lib/resources";

export function generateStaticParams() {
  return resources.map((resource) => ({ id: resource.id }));
}

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = resources.find((item) => item.id === id);
  if (!resource) notFound();

  return <main className="mx-auto min-h-screen max-w-3xl px-5 py-12">
    <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-lime-300"><ArrowLeft size={16} /> Back to library</Link>
    <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-10">
      <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-lime-300 text-zinc-950"><Code2 size={27} /></div>
      <p className="text-sm font-semibold text-lime-300">{resource.category}</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">{resource.title}</h1>
      <p className="mt-5 leading-7 text-zinc-300">{resource.description}</p>
      <div className="mt-8 flex flex-wrap gap-2">{resource.tags.map((tag) => <span key={tag} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400">#{tag}</span>)}</div>
      <div className="mt-10 rounded-xl border border-amber-900/60 bg-amber-950/20 p-4 text-sm leading-6 text-amber-200">This is sample content. Add a verified resource URL and safety notes before publishing a real download.</div>
    </div>
  </main>;
}
