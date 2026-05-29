import { createFileRoute } from "@tanstack/react-router";
import { Target, Heart, Globe2, Sparkles } from "lucide-react";
import { freeImages } from "@/lib/free-images";

export const Route = createFileRoute("/about")({ component: About });

const values = [
  {
    icon: Target,
    title: "Purpose-driven",
    text: "Every feature is built to remove barriers for women entering STEM.",
  },
  {
    icon: Heart,
    title: "Inclusive",
    text: "We welcome all backgrounds, identities, and levels of experience.",
  },
  { icon: Globe2, title: "Global", text: "Stories and resources from women across 40+ countries." },
  {
    icon: Sparkles,
    title: "Inspiring",
    text: "Curated to spark curiosity in the next generation of innovators.",
  },
];

function About() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">About us</p>
        <h1 className="mt-3 font-serif text-4xl text-primary md:text-6xl">
          A platform where every woman in STEM belongs.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          HerSTEM was born from a simple observation: when girls see women succeeding in science and
          technology, they imagine themselves there too. We built this platform to make that
          visibility universal.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 overflow-hidden rounded-2xl">
          <img
            src={freeImages.collaboration.src}
            alt={freeImages.collaboration.alt}
            loading="lazy"
            width={1280}
            height={900}
            className="h-full w-full object-cover"
            title={`Photo: ${freeImages.collaboration.credit}`}
          />
        </div>
        <div className="rounded-2xl bg-[#31566a] p-8 text-primary-foreground">
          <h2 className="font-serif text-2xl">Our mission</h2>
          <p className="mt-3 text-sm text-primary-foreground/80">
            To inspire, educate, and connect women and girls pursuing careers in Science,
            Technology, Engineering, and Mathematics — through stories, learning, and community.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-3xl text-primary">What we stand for</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
              <v.icon className="h-7 w-7 text-accent" />
              <h3 className="mt-3 font-serif text-lg">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-[#d7f2ed] bg-[#f2fffc] p-10 md:p-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-5xl text-primary">2024</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Founded by a small group of students and engineers.
            </p>
          </div>
          <div>
            <p className="font-serif text-5xl text-primary">12k+</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Community members across 40+ countries.
            </p>
          </div>
          <div>
            <p className="font-serif text-5xl text-primary">300+</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Curated videos and interviews available today.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
