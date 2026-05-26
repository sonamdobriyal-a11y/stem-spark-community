import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Send, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/community")({ component: Community });

type Comment = { author: string; text: string };
type Post = { id: number; author: string; initials: string; time: string; title: string; body: string; tag: string; likes: number; liked: boolean; comments: Comment[] };

const initialPosts: Post[] = [
  { id: 1, author: "Amara Okonkwo", initials: "AO", time: "2h ago", title: "Just got my first internship at SpaceX! ", body: "Three years of late-night study sessions paid off. To every woman doubting herself — keep going. Happy to answer questions about the application process!", tag: "Career", likes: 124, liked: false, comments: [
    { author: "Priya S.", text: "Huge congrats! What was your portfolio like?" },
    { author: "Mei L.", text: "So inspiring 💚" },
  ] },
  { id: 2, author: "Dr. Hana Park", initials: "HP", time: "Yesterday", title: "Looking for collab on a bioinformatics paper", body: "I'm exploring ML applications in protein folding. DM if interested — open to undergrads, grads, or industry folks.", tag: "Research", likes: 47, liked: false, comments: [] },
  { id: 3, author: "Sofia Reyes", initials: "SR", time: "2 days ago", title: "Resource thread: best free CS courses", body: "Dropping my favorites: CS50, MIT OCW 6.006, fast.ai. What would you add?", tag: "Resources", likes: 89, liked: false, comments: [
    { author: "Jess T.", text: "Add 3Blue1Brown for the math foundations!" },
  ] },
];

function Community() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", tag: "Discussion" });
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});

  function toggleLike(id: number) {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p));
  }
  function addPost(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setPosts([{ id: Date.now(), author: "You", initials: "Y", time: "now", likes: 0, liked: false, comments: [], ...draft }, ...posts]);
    setDraft({ title: "", body: "", tag: "Discussion" });
    setShowForm(false);
  }
  function addComment(id: number) {
    const text = commentDrafts[id]?.trim();
    if (!text) return;
    setPosts(posts.map(p => p.id === id ? { ...p, comments: [...p.comments, { author: "You", text }] } : p));
    setCommentDrafts({ ...commentDrafts, [id]: "" });
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Community</p>
          <h1 className="mt-3 font-serif text-4xl text-primary md:text-5xl">A space to share, ask, and grow.</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-1 h-4 w-4" /> New post
        </Button>
      </header>

      {showForm && (
        <form onSubmit={addPost} className="mt-8 rounded-2xl border border-border bg-card p-6 space-y-4">
          <Input placeholder="Post title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <Textarea placeholder="What's on your mind?" rows={4} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <div className="flex items-center gap-3">
            <select value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>Discussion</option><option>Career</option><option>Research</option><option>Resources</option><option>Question</option>
            </select>
            <Button type="submit">Publish</Button>
          </div>
        </form>
      )}

      <ul className="mt-10 space-y-6">
        {posts.map((p) => (
          <li key={p.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{p.initials}</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="font-semibold">{p.author}</p>
                  <span className="text-xs text-muted-foreground">· {p.time}</span>
                  <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-primary">{p.tag}</span>
                </div>
                <h3 className="mt-2 font-serif text-xl text-primary">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
                  <button onClick={() => toggleLike(p.id)} className="inline-flex items-center gap-1.5 hover:text-primary">
                    <Heart className={`h-4 w-4 ${p.liked ? "fill-accent text-accent" : ""}`} /> {p.likes}
                  </button>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" /> {p.comments.length}
                  </span>
                </div>
                {p.comments.length > 0 && (
                  <ul className="mt-4 space-y-2 border-l-2 border-accent/30 pl-4">
                    {p.comments.map((c, i) => (
                      <li key={i} className="text-sm"><span className="font-semibold text-primary">{c.author}</span> <span className="text-muted-foreground">{c.text}</span></li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex gap-2">
                  <Input placeholder="Write a comment…" value={commentDrafts[p.id] ?? ""} onChange={(e) => setCommentDrafts({ ...commentDrafts, [p.id]: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addComment(p.id); } }} />
                  <Button size="icon" variant="outline" onClick={() => addComment(p.id)} aria-label="Send comment"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
