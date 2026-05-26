import { createFileRoute } from "@tanstack/react-router";
import { Quote, Play } from "lucide-react";

export const Route = createFileRoute("/interviews")({ component: Interviews });

const interviews = [
  {
    name: "Dr. Fei-Fei Li",
    role: "AI Researcher, Stanford",
    type: "Industry",
    quote:
      "I want every young woman to know there's a seat for her at the table of artificial intelligence.",
  },
  {
    name: "Aisha Bowe",
    role: "Former NASA engineer, founder STEMBoard",
    type: "Industry",
    quote: "If you can see her, you can be her. Representation is the most powerful curriculum.",
  },
  {
    name: "Priya Sharma",
    role: "PhD candidate, MIT",
    type: "Student",
    quote: "Imposter syndrome doesn't go away — you just learn to keep building anyway.",
  },
  {
    name: "Dr. Gladys West",
    role: "Mathematician, GPS pioneer",
    type: "Industry",
    quote:
      "When I was doing the work, I didn't know it would change the world. I just knew it had to be right.",
  },
  {
    name: "Maya Patel",
    role: "Undergrad, Robotics",
    type: "Student",
    quote: "Joining a community of women engineers changed my entire trajectory in college.",
  },
  {
    name: "Dr. Joy Buolamwini",
    role: "Founder, Algorithmic Justice League",
    type: "Industry",
    quote: "We have to ask not just what AI can do, but who it's built for.",
  },
];

function Interviews() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Hear from Women in STEM
        </p>
        <h1 className="mt-3 font-serif text-4xl text-primary md:text-5xl">
          Real stories, in their own words.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Conversations with students charting their first steps and leaders shaping entire fields.
        </p>
      </header>

      {/* Featured */}
      <section className="mt-12 overflow-hidden rounded-3xl bg-primary text-primary-foreground">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto">
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary via-teal/80 to-accent/80">
              <button className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground transition hover:scale-105">
                <Play className="h-6 w-6 fill-current" />
              </button>
            </div>
          </div>
          <div className="p-8 md:p-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Featured interview
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              "I built the career I couldn't see."
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Dr. Reshma Saujani — founder of Girls Who Code — on building a movement, raising
              daughters, and the future of STEM education.
            </p>
            <p className="mt-6 text-sm text-primary-foreground/60">42 min · Published last week</p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {interviews.map((i) => (
          <article
            key={i.name}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <span className="inline-block w-fit rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-primary">
              {i.type}
            </span>
            <Quote className="mt-4 h-6 w-6 text-accent" />
            <p className="mt-2 font-serif text-lg leading-snug text-foreground">"{i.quote}"</p>
            <div className="mt-auto pt-6">
              <p className="font-serif text-lg text-primary">{i.name}</p>
              <p className="text-sm text-muted-foreground">{i.role}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
