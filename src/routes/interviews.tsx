import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Play, Quote } from "lucide-react";
import { subscribeToInterviewVideos, type InterviewVideo } from "@/lib/interview-videos-firestore";

export const Route = createFileRoute("/interviews")({ component: Interviews });

const fallbackInterviews: InterviewVideo[] = [
  {
    id: "fallback-fei-fei-li",
    title: "A seat at the table of artificial intelligence",
    guestName: "Dr. Fei-Fei Li",
    guestRole: "AI Researcher, Stanford",
    type: "Industry",
    quote:
      "I want every young woman to know there's a seat for her at the table of artificial intelligence.",
    description: "A conversation about building inclusive AI and opening pathways into research.",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
  },
  {
    id: "fallback-aisha-bowe",
    title: "Representation as curriculum",
    guestName: "Aisha Bowe",
    guestRole: "Former NASA engineer, founder STEMBoard",
    type: "Industry",
    quote: "If you can see her, you can be her. Representation is the most powerful curriculum.",
    description: "A founder perspective on engineering, entrepreneurship, and mentorship.",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
  },
  {
    id: "fallback-priya-sharma",
    title: "Building through imposter syndrome",
    guestName: "Priya Sharma",
    guestRole: "PhD candidate, MIT",
    type: "Student",
    quote: "Imposter syndrome doesn't go away — you just learn to keep building anyway.",
    description: "A student story about research, confidence, and finding community.",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
  },
  {
    id: "fallback-gladys-west",
    title: "The work that had to be right",
    guestName: "Dr. Gladys West",
    guestRole: "Mathematician, GPS pioneer",
    type: "Industry",
    quote:
      "When I was doing the work, I didn't know it would change the world. I just knew it had to be right.",
    description: "A look at precision, persistence, and mathematical impact.",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
  },
  {
    id: "fallback-maya-patel",
    title: "Finding a robotics community",
    guestName: "Maya Patel",
    guestRole: "Undergrad, Robotics",
    type: "Student",
    quote: "Joining a community of women engineers changed my entire trajectory in college.",
    description: "An undergraduate perspective on robotics teams and peer support.",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
  },
  {
    id: "fallback-joy-buolamwini",
    title: "Who AI is built for",
    guestName: "Dr. Joy Buolamwini",
    guestRole: "Founder, Algorithmic Justice League",
    type: "Industry",
    quote: "We have to ask not just what AI can do, but who it's built for.",
    description: "A discussion on ethics, accountability, and public-interest technology.",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
  },
];

function Interviews() {
  const [interviews, setInterviews] = useState<InterviewVideo[]>(fallbackInterviews);

  useEffect(() => {
    const unsubscribe = subscribeToInterviewVideos(
      (videos) => {
        setInterviews(videos.length > 0 ? videos : fallbackInterviews);
      },
      (error) => {
        console.error("Failed to subscribe to interview videos", error);
      },
    );

    return () => unsubscribe?.();
  }, []);

  const featured = interviews[0];

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

      <section className="mt-12 overflow-hidden rounded-3xl bg-[#31566a] text-primary-foreground">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video overflow-hidden md:aspect-auto">
            {featured.thumbnailUrl ? (
              <img
                src={featured.thumbnailUrl}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#31566a] via-teal/70 to-accent/70" />
            )}
            <div className="absolute inset-0 grid place-items-center bg-[#31566a]/15">
              {featured.videoUrl ? (
                <a
                  href={featured.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground transition hover:scale-105"
                  aria-label={`Watch ${featured.title}`}
                >
                  <Play className="h-6 w-6 fill-current" />
                </a>
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Play className="h-6 w-6 fill-current" />
                </div>
              )}
            </div>
          </div>
          <div className="p-8 md:p-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Featured interview
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">{featured.title}</h2>
            <p className="mt-4 text-primary-foreground/80">{featured.description}</p>
            <p className="mt-6 text-sm text-primary-foreground/60">
              {featured.guestName} · {featured.guestRole}
              {featured.duration ? ` · ${featured.duration}` : ""}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {interviews.map((interview) => (
          <article
            key={interview.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            {interview.thumbnailUrl && (
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={interview.thumbnailUrl}
                  alt={interview.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <span className="inline-block w-fit rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                {interview.type}
              </span>
              <Quote className="mt-4 h-6 w-6 text-accent" />
              <p className="mt-2 font-serif text-lg leading-snug text-foreground">
                "{interview.quote}"
              </p>
              <div className="mt-auto pt-6">
                <p className="font-serif text-lg text-primary">{interview.guestName}</p>
                <p className="text-sm text-muted-foreground">{interview.guestRole}</p>
                {interview.videoUrl && (
                  <a
                    href={interview.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"
                  >
                    Watch interview <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
