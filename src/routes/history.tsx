import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/history")({ component: History });

const figures = [
  { year: "1843", name: "Ada Lovelace", role: "First computer programmer", story: "Wrote the first algorithm intended to be processed by a machine — Charles Babbage's Analytical Engine — over a century before modern computers existed." },
  { year: "1903", name: "Marie Curie", role: "Pioneer of radioactivity", story: "The first woman to win a Nobel Prize, and the only person to win Nobels in two different sciences (Physics and Chemistry)." },
  { year: "1944", name: "Grace Hopper", role: "Inventor of the compiler", story: "Created the first compiler and co-developed COBOL, transforming computers from research curiosities into business tools." },
  { year: "1952", name: "Rosalind Franklin", role: "Discovered DNA structure", story: "Her X-ray diffraction images of DNA were critical to the discovery of the double helix structure of life itself." },
  { year: "1962", name: "Katherine Johnson", role: "NASA mathematician", story: "Her orbital calculations made John Glenn's first American orbit of Earth possible — he refused to fly until she'd verified the numbers." },
  { year: "1977", name: "Hedy Lamarr", role: "Inventor of frequency hopping", story: "Co-invented the spread-spectrum technology that underlies modern Wi-Fi, Bluetooth, and GPS." },
  { year: "1985", name: "Radia Perlman", role: "Mother of the Internet", story: "Invented the Spanning Tree Protocol — the foundation that made large networks like the Internet possible." },
  { year: "2014", name: "Maryam Mirzakhani", role: "Fields Medal winner", story: "The first woman to win mathematics' highest honor, for her work on the dynamics and geometry of Riemann surfaces." },
];

function History() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">History of Women in Tech</p>
        <h1 className="mt-3 font-serif text-4xl text-primary md:text-5xl">The women who built the modern world.</h1>
        <p className="mt-4 text-muted-foreground">
          Their names weren't always in the textbooks — but the technology you use every day exists because of them. Here are some of the trailblazers whose work shapes science and computing.
        </p>
      </header>

      <div className="relative mt-14">
        <div className="absolute left-4 top-0 bottom-0 hidden w-px bg-gradient-to-b from-accent via-primary/40 to-transparent md:block md:left-1/2" />
        <ul className="space-y-10">
          {figures.map((f, i) => (
            <li key={f.name} className={`relative grid gap-6 md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
              <div className="md:text-right">
                <span className="inline-block rounded-full bg-accent/15 px-3 py-1 font-serif text-sm font-semibold text-primary">{f.year}</span>
                <h3 className="mt-3 font-serif text-2xl text-primary md:text-3xl">{f.name}</h3>
                <p className="text-sm font-medium uppercase tracking-wider text-accent">{f.role}</p>
              </div>
              <div className="relative rounded-2xl border border-border bg-card p-6">
                <span className="absolute -left-2 top-7 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background md:block md:left-[-3rem]" />
                <p className="text-sm leading-relaxed text-muted-foreground">{f.story}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <section className="mt-20 rounded-3xl bg-[#31566a] p-10 text-primary-foreground md:p-14">
        <h2 className="font-serif text-3xl md:text-4xl">"I was taught the way of progress is neither swift nor easy."</h2>
        <p className="mt-3 text-sm text-primary-foreground/75">— Marie Curie</p>
      </section>
    </div>
  );
}
