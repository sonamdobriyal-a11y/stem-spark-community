import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, MessageCircle, Mic, Sparkles, Users, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { freeImages } from "@/lib/free-images";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* Hero bento */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-[minmax(0,auto)_170px] md:gap-5 lg:grid-rows-[minmax(0,auto)_185px]">
        {/* Headline */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:col-span-4 md:row-span-1 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Welcome to HerSTEM
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-primary md:text-6xl">
            Where women in <span className="italic text-accent">STEM</span> rise, share, and lead.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            A home for curious minds — discover learning resources, hear from trailblazers, and join
            a community building the future of science and technology.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[#31566a] text-white hover:bg-[#294b5d]">
              <Link to="/signin">
                Join HerSTEM <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#adc3ce] text-[#31566a] hover:bg-[#eef6f9]"
            >
              <Link to="/resources">Explore resources</Link>
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 md:min-h-0">
          <img
            src={freeImages.hero.src}
            alt={freeImages.hero.alt}
            width={1800}
            height={1350}
            className="h-full w-full object-cover object-center"
            title={`Photo: ${freeImages.hero.credit}`}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3b6170]/70 to-transparent p-5 text-white">
            <p className="font-serif text-lg">"The future belongs to those who imagine it."</p>
            <p className="mt-1 text-xs opacity-80">— Dr. Mae Jemison</p>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl border border-border bg-secondary p-6 md:col-span-2 md:h-full">
          <p className="font-serif text-4xl text-primary">28%</p>
          <p className="mt-1 text-sm text-muted-foreground">
            of the global STEM workforce is women. We're changing that — one mentor at a time.
          </p>
        </div>

        {/* Resources teaser */}
        <Link
          to="/resources"
          className="group relative overflow-hidden rounded-2xl border border-[#c8dce5] bg-[#eef7fb] p-6 text-primary md:col-span-2 md:h-full"
        >
          <BookOpen className="h-7 w-7 text-[#d65f82]" />
          <h3 className="mt-3 font-serif text-2xl">Learning library</h3>
          <p className="mt-1 text-sm opacity-80">
            Curated videos across math, biology, code &amp; more.
          </p>
          <ArrowRight className="absolute right-5 top-5 h-5 w-5 text-[#d65f82] transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Feature bento */}
      <section className="mt-16">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d65f82]">
              Everything in one place
            </p>
            <h2 className="mt-2 font-serif text-3xl text-primary md:text-4xl">
              Five spaces. One mission.
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Learn from the past, connect in the present, and build what's next.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[180px] md:gap-5">
          <FeatureCard
            to="/history"
            className="md:col-span-3 md:row-span-2"
            tone="sky"
            icon={<History className="h-6 w-6" />}
            title="History of Women in Tech"
            desc="From Ada Lovelace to Katherine Johnson — meet the women who built modern computing, with full timelines and stories."
            image={freeImages.equations.src}
            imageCredit={freeImages.equations.credit}
          />
          <FeatureCard
            to="/community"
            className="md:col-span-3"
            tone="peach"
            icon={<Users className="h-6 w-6" />}
            title="Community"
            desc="Post, comment, and connect with peers across disciplines."
          />
          <FeatureCard
            to="/interviews"
            className="md:col-span-3"
            tone="mint"
            icon={<Mic className="h-6 w-6" />}
            title="Hear from Women in STEM"
            desc="Long-form interviews with students &amp; industry leaders."
          />
          <FeatureCard
            to="/about"
            className="md:col-span-2"
            tone="lavender"
            icon={<Sparkles className="h-6 w-6" />}
            title="About us"
            desc="Our mission &amp; the team behind it."
          />
          <FeatureCard
            to="/resources"
            className="md:col-span-2"
            tone="aqua"
            icon={<BookOpen className="h-6 w-6" />}
            title="Resources"
            desc="Video libraries by subject."
          />
          <FeatureCard
            to="/community"
            className="md:col-span-2"
            tone="rose"
            icon={<MessageCircle className="h-6 w-6" />}
            title="Share your story"
            desc="Be the role model someone needs."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 overflow-hidden rounded-3xl border border-[#c8dce5] bg-[#eef7fb]">
        <div className="grid md:grid-cols-2">
          <div className="p-10 text-primary md:p-14">
            <h2 className="font-serif text-3xl md:text-4xl">Ready to add your voice?</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Create a free account to join the community, save resources, and share your journey.
            </p>
            <Button asChild size="lg" className="mt-7 bg-[#f3c8b6] text-primary hover:bg-[#edbca5]">
              <Link to="/signin">Create your account</Link>
            </Button>
          </div>
          <div className="relative min-h-[260px]">
            <img
              src={freeImages.collaboration.src}
              alt={freeImages.collaboration.alt}
              loading="lazy"
              width={1280}
              height={900}
              className="absolute inset-0 h-full w-full object-cover"
              title={`Photo: ${freeImages.collaboration.credit}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  to,
  className = "",
  tone,
  icon,
  title,
  desc,
  image,
  imageCredit,
}: {
  to: string;
  className?: string;
  tone: "sky" | "peach" | "mint" | "lavender" | "aqua" | "rose";
  icon: React.ReactNode;
  title: string;
  desc: string;
  image?: string;
  imageCredit?: string;
}) {
  const tones = {
    sky: "border-[#d5e5ee] bg-[#f5fbfe] text-primary",
    peach: "border-[#efd9c8] bg-[#fff7f1] text-primary",
    mint: "border-[#bceee5] bg-[#e9fbf7] text-primary",
    lavender: "border-[#d7c8f3] bg-[#f6f1ff] text-primary",
    aqua: "border-[#abdfe4] bg-[#ebfbfd] text-primary",
    rose: "border-[#efb7ca] bg-[#ffe8f0] text-primary",
  };
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl border p-6 transition hover:-translate-y-0.5 hover:shadow-md ${tones[tone]} ${className}`}
    >
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          title={imageCredit ? `Photo: ${imageCredit}` : undefined}
          className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-multiply"
        />
      )}
      <div className="relative flex h-full flex-col">
        <div className="opacity-90">{icon}</div>
        <h3 className="mt-3 font-serif text-xl md:text-2xl">{title}</h3>
        <p className="mt-1 text-sm opacity-80">{desc}</p>
        <ArrowRight className="mt-auto h-5 w-5 self-end opacity-70 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
