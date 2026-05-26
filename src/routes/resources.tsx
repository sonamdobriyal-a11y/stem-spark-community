import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, ExternalLink, Beaker, Code2, Calculator, Cpu, Dna, Rocket } from "lucide-react";

export const Route = createFileRoute("/resources")({ component: Resources });

const subjects = [
  { id: "all", label: "All", icon: Rocket },
  { id: "math", label: "Mathematics", icon: Calculator },
  { id: "cs", label: "Computer Science", icon: Code2 },
  { id: "bio", label: "Biology", icon: Dna },
  { id: "chem", label: "Chemistry", icon: Beaker },
  { id: "eng", label: "Engineering", icon: Cpu },
];

const videos = [
  { subj: "math", title: "The Beauty of Mathematics", author: "Eddie Woo", url: "https://www.youtube.com/watch?v=LXTfewjK9Yc", thumb: "https://img.youtube.com/vi/LXTfewjK9Yc/hqdefault.jpg" },
  { subj: "cs", title: "How Computers Really Work", author: "Crash Course", url: "https://www.youtube.com/watch?v=tpIctyqH29Q", thumb: "https://img.youtube.com/vi/tpIctyqH29Q/hqdefault.jpg" },
  { subj: "cs", title: "Intro to Python Programming", author: "freeCodeCamp", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", thumb: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg" },
  { subj: "bio", title: "Inside the Cell", author: "TED-Ed", url: "https://www.youtube.com/watch?v=URUJD5NEXC8", thumb: "https://img.youtube.com/vi/URUJD5NEXC8/hqdefault.jpg" },
  { subj: "chem", title: "Crash Course Chemistry", author: "CrashCourse", url: "https://www.youtube.com/watch?v=FSyAehMdpyI", thumb: "https://img.youtube.com/vi/FSyAehMdpyI/hqdefault.jpg" },
  { subj: "eng", title: "How Bridges Are Engineered", author: "Practical Engineering", url: "https://www.youtube.com/watch?v=PIK2oCzdjE0", thumb: "https://img.youtube.com/vi/PIK2oCzdjE0/hqdefault.jpg" },
  { subj: "math", title: "Essence of Linear Algebra", author: "3Blue1Brown", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs", thumb: "https://img.youtube.com/vi/fNk_zzaMoSs/hqdefault.jpg" },
  { subj: "bio", title: "DNA Structure & Replication", author: "Bozeman Science", url: "https://www.youtube.com/watch?v=8kK2zwjRV0M", thumb: "https://img.youtube.com/vi/8kK2zwjRV0M/hqdefault.jpg" },
  { subj: "eng", title: "Mechanical Engineering Basics", author: "Lesics", url: "https://www.youtube.com/watch?v=Jzy7zE8MGz0", thumb: "https://img.youtube.com/vi/Jzy7zE8MGz0/hqdefault.jpg" },
];

function Resources() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? videos : videos.filter((v) => v.subj === active);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Resources</p>
        <h1 className="mt-3 font-serif text-4xl text-primary md:text-5xl">A library of learning, by subject.</h1>
        <p className="mt-4 text-muted-foreground">Hand-picked videos to help you explore — or master — any STEM subject.</p>
      </header>

      <div className="mt-10 flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${active === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"}`}
          >
            <s.icon className="h-4 w-4" /> {s.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <a key={v.url} href={v.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img src={v.thumb} alt={v.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 grid place-items-center bg-primary/0 transition group-hover:bg-primary/30">
                <div className="rounded-full bg-accent p-3 text-accent-foreground opacity-0 transition group-hover:opacity-100">
                  <Play className="h-5 w-5 fill-current" />
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wider text-accent">{subjects.find(s => s.id === v.subj)?.label}</p>
              <h3 className="mt-1 font-serif text-lg leading-snug text-primary">{v.title}</h3>
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>{v.author}</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
