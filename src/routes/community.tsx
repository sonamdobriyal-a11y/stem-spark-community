import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Heart, MessageCircle, PlusCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthUser } from "@/hooks/use-auth-user";
import {
  createCommunityComment,
  createCommunityPost,
  subscribeToCommunityPosts,
  updateCommunityLike,
  type CommunityPost,
} from "@/lib/community-firestore";
import { getDisplayName } from "@/lib/auth";

export const Route = createFileRoute("/community")({ component: Community });

const emptyDraft = { title: "", body: "", tag: "Discussion" };

function Community() {
  const { user, loading, isConfigured } = useAuthUser();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isConfigured || !user) {
      setPosts([]);
      return;
    }

    const unsubscribe = subscribeToCommunityPosts(
      user.uid,
      (firestorePosts) => {
        setPosts(firestorePosts);
        setStatus("");
      },
      (error) => {
        console.error("Failed to subscribe to community posts", error);
        setStatus("Unable to load community posts. Check Firestore rules and configuration.");
      },
    );

    return () => unsubscribe?.();
  }, [isConfigured, user]);

  const userStats = useMemo(() => {
    if (!user) return { posts: 0, likes: 0, comments: 0 };

    const ownPosts = posts.filter((post) => post.userId === user.uid);
    return {
      posts: ownPosts.length,
      likes: ownPosts.reduce((total, post) => total + post.likes, 0),
      comments: ownPosts.reduce((total, post) => total + post.comments.length, 0),
    };
  }, [posts, user]);

  async function toggleLike(id: string) {
    if (!user) {
      setStatus("Sign in to like posts.");
      return;
    }

    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const liked = !post.liked;
    setPosts((current) =>
      current.map((p) =>
        p.id === id ? { ...p, liked, likes: Math.max(0, p.likes + (liked ? 1 : -1)) } : p,
      ),
    );

    try {
      await updateCommunityLike(id, user.uid, liked);
    } catch (error) {
      console.error("Failed to update like", error);
      setPosts((current) =>
        current.map((p) => (p.id === id ? { ...p, liked: post.liked, likes: post.likes } : p)),
      );
      setStatus("Unable to update that like. Check Firestore rules.");
    }
  }

  async function addPost(e: FormEvent) {
    e.preventDefault();
    setStatus("");

    if (!user) {
      setStatus("Sign in to create a post.");
      return;
    }

    const title = draft.title.trim();
    const body = draft.body.trim();
    if (!title || !body) {
      setStatus("Add a title and post body before publishing.");
      return;
    }

    try {
      await createCommunityPost({ title, body, tag: draft.tag }, user);
      setDraft(emptyDraft);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create community post", error);
      setStatus("Unable to publish your post. Check Firestore rules and configuration.");
    }
  }

  async function addComment(id: string) {
    if (!user) {
      setStatus("Sign in to comment on posts.");
      return;
    }

    const text = commentDrafts[id]?.trim();
    if (!text) return;

    const localComment = {
      userId: user.uid,
      author: getDisplayName(user),
      text,
      createdAt: new Date(),
    };

    setPosts((current) =>
      current.map((p) => (p.id === id ? { ...p, comments: [...p.comments, localComment] } : p)),
    );
    setCommentDrafts((current) => ({ ...current, [id]: "" }));

    try {
      await createCommunityComment(id, text, user);
    } catch (error) {
      console.error("Failed to create community comment", error);
      setStatus("Unable to add your comment. Check Firestore rules.");
    }
  }

  if (!isConfigured) {
    return (
      <AuthStateShell
        eyebrow="Community"
        title="Firebase is required for community posts."
        body="Add the VITE_FIREBASE_* values from .env.example to .env or .env.local, then restart the dev server."
      />
    );
  }

  if (loading) {
    return (
      <AuthStateShell
        eyebrow="Community"
        title="Checking your session..."
        body="Your community feed will load once authentication is ready."
      />
    );
  }

  if (!user) {
    return (
      <AuthStateShell
        eyebrow="Community"
        title="Sign in to join the community."
        body="Create an account or sign in to publish posts, like updates, and comment on discussions."
        action={
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/signin">Sign in</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Community</p>
          <h1 className="mt-3 font-serif text-4xl text-primary md:text-5xl">
            A space to share, ask, and grow.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">Signed in as {getDisplayName(user)}.</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusCircle className="mr-1 h-4 w-4" /> New post
        </Button>
      </header>

      <section className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-3">
        <Stat label="Your posts" value={userStats.posts} />
        <Stat label="Likes on your posts" value={userStats.likes} />
        <Stat label="Comments on your posts" value={userStats.comments} />
      </section>

      {showForm && (
        <form
          onSubmit={addPost}
          className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6"
        >
          <Input
            placeholder="Post title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <Textarea
            placeholder="What's on your mind?"
            rows={4}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={draft.tag}
              onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Discussion</option>
              <option>Career</option>
              <option>Research</option>
              <option>Resources</option>
              <option>Question</option>
            </select>
            <Button type="submit">Publish</Button>
          </div>
        </form>
      )}

      {status && (
        <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-primary">
          {status}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <h2 className="font-serif text-2xl text-primary">No posts yet.</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Start the first conversation. Once people like or comment on your post, your interaction
            totals will show above.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="mt-5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusCircle className="mr-1 h-4 w-4" /> Create a post
          </Button>
        </div>
      ) : (
        <ul className="mt-10 space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {post.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="font-semibold">{post.author}</p>
                    <span className="text-xs text-muted-foreground">· {formatPostTime(post)}</span>
                    {post.userId === user.uid && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-primary">
                        Your post
                      </span>
                    )}
                    <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-primary">
                      {post.tag}
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-xl text-primary">{post.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
                  <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="inline-flex items-center gap-1.5 hover:text-primary"
                    >
                      <Heart className={`h-4 w-4 ${post.liked ? "fill-accent text-accent" : ""}`} />
                      {post.likes}
                    </button>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" /> {post.comments.length}
                    </span>
                  </div>
                  {post.comments.length > 0 && (
                    <ul className="mt-4 space-y-2 border-l-2 border-accent/30 pl-4">
                      {post.comments.map((comment, index) => (
                        <li key={`${comment.userId}-${index}`} className="text-sm">
                          <span className="font-semibold text-primary">{comment.author}</span>{" "}
                          <span className="text-muted-foreground">{comment.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={commentDrafts[post.id] ?? ""}
                      onChange={(e) =>
                        setCommentDrafts({ ...commentDrafts, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addComment(post.id);
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => addComment(post.id)}
                      aria-label="Send comment"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-3xl text-primary">{value}</p>
    </div>
  );
}

function AuthStateShell({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl text-primary">{title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{body}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

function formatPostTime(post: CommunityPost) {
  const createdAt = post.createdAt;
  const date =
    createdAt instanceof Date
      ? createdAt
      : createdAt && "toDate" in createdAt
        ? createdAt.toDate()
        : null;

  if (!date) return "now";

  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
