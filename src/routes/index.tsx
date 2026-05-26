import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, MessageCircle, Mic, Sparkles, Users, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-woman.jpg";
import collabImg from "@/assets/collab.jpg";
import equationsImg from "@/assets/equations.jpg";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* Hero bento */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2 md:gap-5">
        {/* Headline */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:col-span-4 md:row-span-1 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Welcome to HerSTEM
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-primary md:text-6xl">
            Where women in <span className="italic text-accent">STEM</span> rise, share, and lead.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            A home for curious minds — discover learning resources, hear from trailblazers, and join a community building the future of science and technology.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/signin">Join HerSTEM <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/30 text-primary">
              <Link to="/resources">Explore resources</Link>
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2">
          <img src={heroImg} alt="Woman scientist in a modern laboratory" width={1280} height={1600} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-5 text-primary-foreground">
            <p className="font-serif text-lg">"The future belongs to those who imagine it."</p>
            <p className="mt-1 text-xs opacity-80">— Dr. Mae Jemison</p>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl border border-border bg-secondary p-6 md:col-span-2">
          <p className="font-serif text-4xl text-primary">28%</p>
          <p className="mt-1 text-sm text-muted-foreground">of the global STEM workforce is women. We're changing that — one mentor at a time.</p>
        </div>

        {/* Resources teaser */}
        <Link to="/resources" className="group relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground md:col-span-2">
          <BookOpen className="h-7 w-7 text-accent" />
          <h3 className="mt-3 font-serif text-2xl">Learning library</h3>
          <p className="mt-1 text-sm opacity-80">Curated videos across math, biology, code &amp; more.</p>
          <ArrowRight className="absolute right-5 top-5 h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Feature bento */}
      <section className="mt-16">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Everything in one place</p>
            <h2 className="mt-2 font-serif text-3xl text-primary md:text-4xl">Five spaces. One mission.</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">Learn from the past, connect in the present, and build what's next.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[180px] md:gap-5">
          <FeatureCard to="/history" className="md:col-span-3 md:row-span-2" tone="emerald" icon={<History className="h-6 w-6" />} title="History of Women in Tech" desc="From Ada Lovelace to Katherine Johnson — meet the women who built modern computing, with full timelines and stories." image={equationsImg} />
          <FeatureCard to="/community" className="md:col-span-3" tone="gold" icon={<Users className="h-6 w-6" />} title="Community" desc="Post, comment, and connect with peers across disciplines." />
          <FeatureCard to="/interviews" className="md:col-span-3" tone="cream" icon={<Mic className="h-6 w-6" />} title="Hear from Women in STEM" desc="Long-form interviews with students &amp; industry leaders." />
          <FeatureCard to="/about" className="md:col-span-2" tone="emerald" icon={<Sparkles className="h-6 w-6" />} title="About us" desc="Our mission &amp; the team behind it." />
          <FeatureCard to="/resources" className="md:col-span-2" tone="cream" icon={<BookOpen className="h-6 w-6" />} title="Resources" desc="Video libraries by subject." />
          <FeatureCard to="/community" className="md:col-span-2" tone="gold" icon={<MessageCircle className="h-6 w-6" />} title="Share your story" desc="Be the role model someone needs." />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 overflow-hidden rounded-3xl bg-primary">
        <div className="grid md:grid-cols-2">
          <div className="p-10 text-primary-foreground md:p-14">
            <h2 className="font-serif text-3xl md:text-4xl">Ready to add your voice?</h2>
            <p className="mt-4 max-w-md text-primary-foreground/80">Create a free account to join the community, save resources, and share your journey.</p>
            <Button asChild size="lg" className="mt-7 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/signin">Create your account</Link>
            </Button>
          </div>
          <div className="relative min-h-[260px]">
            <img src={collabImg} alt="Women collaborating on a project" loading="lazy" width={1280} height={900} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ to, className = "", tone, icon, title, desc, image }: {
  to: string; className?: string; tone: "emerald" | "gold" | "cream"; icon: React.ReactNode; title: string; desc: string; image?: string;
}) {
  const tones = {
    emerald: "bg-primary text-primary-foreground",
    gold: "bg-accent text-accent-foreground",
    cream: "bg-secondary text-secondary-foreground",
  };
  return (
    <Link to={to} className={`group relative overflow-hidden rounded-2xl border border-border p-6 transition-transform hover:-translate-y-0.5 ${tones[tone]} ${className}`}>
      {image && <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-multiply" />}
      <div className="relative flex h-full flex-col">
        <div className="opacity-90">{icon}</div>
        <h3 className="mt-3 font-serif text-xl md:text-2xl">{title}</h3>
        <p className="mt-1 text-sm opacity-80">{desc}</p>
        <ArrowRight className="mt-auto h-5 w-5 self-end opacity-70 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
