import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Database, LockKeyhole, PlusCircle, ShieldAlert, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthUser } from "@/hooks/use-auth-user";
import { hasAdminAllowlist } from "@/lib/auth";
import {
  createInterviewVideo,
  getUsersCount,
  subscribeToInterviewVideos,
  type InterviewVideo,
  type InterviewVideoInput,
} from "@/lib/interview-videos-firestore";

export const Route = createFileRoute("/admin")({ component: Admin });

const emptyDraft: InterviewVideoInput = {
  title: "",
  guestName: "",
  guestRole: "",
  type: "Industry",
  quote: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
  duration: "",
};

function Admin() {
  const { user, loading, isAdmin, isConfigured } = useAuthUser();
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [videos, setVideos] = useState<InterviewVideo[]>([]);
  const [draft, setDraft] = useState<InterviewVideoInput>(emptyDraft);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isConfigured || loading || !user || !isAdmin) {
      setUsersCount(null);
      setVideos([]);
      return;
    }

    getUsersCount()
      .then((count) => setUsersCount(count ?? 0))
      .catch((error) => {
        console.error("Failed to load users count", error);
        setUsersCount(0);
      });

    const unsubscribe = subscribeToInterviewVideos(
      (items) => setVideos(items),
      (error) => {
        console.error("Failed to subscribe to interview videos", error);
        setStatus("Unable to load interview videos. Check Firestore rules.");
      },
    );

    return () => unsubscribe?.();
  }, [isAdmin, isConfigured, loading, user]);

  async function addVideo(e: FormEvent) {
    e.preventDefault();
    setStatus("");

    if (!user || !isAdmin) {
      setStatus("Only signed-in admins can publish interview videos.");
      return;
    }

    const input = {
      ...draft,
      title: draft.title.trim(),
      guestName: draft.guestName.trim(),
      guestRole: draft.guestRole.trim(),
      quote: draft.quote.trim(),
      description: draft.description.trim(),
      videoUrl: draft.videoUrl.trim(),
      thumbnailUrl: draft.thumbnailUrl.trim(),
      duration: draft.duration.trim(),
    };

    if (!input.title || !input.guestName || !input.videoUrl) {
      setStatus("Title, guest name, and video URL are required.");
      return;
    }

    try {
      await createInterviewVideo(input);
      setDraft(emptyDraft);
      setStatus("Interview video added.");
    } catch (error) {
      console.error("Failed to add interview video", error);
      setStatus("Unable to add interview video. Check Firestore rules and config.");
    }
  }

  if (!isConfigured) {
    return (
      <AdminState
        icon={<LockKeyhole className="h-8 w-8" />}
        title="Firebase is not configured."
        body="Add the VITE_FIREBASE_* values from .env.example to .env or .env.local, then restart the dev server before using admin."
      />
    );
  }

  if (!hasAdminAllowlist()) {
    return (
      <AdminState
        icon={<ShieldAlert className="h-8 w-8" />}
        title="Admin allowlist is missing."
        body="Add VITE_ADMIN_EMAILS to .env with the admin email addresses allowed to open this route."
      />
    );
  }

  if (loading) {
    return (
      <AdminState
        icon={<LockKeyhole className="h-8 w-8" />}
        title="Checking admin access..."
        body="The admin dashboard will load after your signed-in session is verified."
      />
    );
  }

  if (!user) {
    return (
      <AdminState
        icon={<LockKeyhole className="h-8 w-8" />}
        title="Sign in required."
        body="Only allowlisted admin accounts can manage portal content."
        action={
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/signin">Sign in</Link>
          </Button>
        }
      />
    );
  }

  if (!isAdmin) {
    return (
      <AdminState
        icon={<ShieldAlert className="h-8 w-8" />}
        title="You do not have admin access."
        body={`The signed-in account ${user.email ?? "without an email"} is not in VITE_ADMIN_EMAILS.`}
        action={
          <Button asChild variant="outline">
            <Link to="/community">Back to community</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Admin</p>
        <h1 className="mt-3 font-serif text-4xl text-primary md:text-5xl">
          Manage portal content.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Track user totals and publish video interviews to the public interviews page.
        </p>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <MetricCard
          icon={<Users className="h-6 w-6" />}
          label="Users"
          value={usersCount === null ? "Loading" : String(usersCount)}
        />
        <MetricCard
          icon={<Video className="h-6 w-6" />}
          label="Interview videos"
          value={videos.length}
        />
        <MetricCard
          icon={<Database className="h-6 w-6" />}
          label="Data source"
          value="Protected Firestore"
        />
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form onSubmit={addVideo} className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-2xl text-primary">Add interview video</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field
              label="Video title"
              value={draft.title}
              onChange={(title) => setDraft({ ...draft, title })}
            />
            <Field
              label="Guest name"
              value={draft.guestName}
              onChange={(guestName) => setDraft({ ...draft, guestName })}
            />
            <Field
              label="Guest role"
              value={draft.guestRole}
              onChange={(guestRole) => setDraft({ ...draft, guestRole })}
            />
            <div>
              <Label htmlFor="video-type">Type</Label>
              <select
                id="video-type"
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option>Industry</option>
                <option>Student</option>
                <option>Research</option>
                <option>Founder</option>
                <option>Mentor</option>
              </select>
            </div>
            <Field
              label="Video URL"
              value={draft.videoUrl}
              onChange={(videoUrl) => setDraft({ ...draft, videoUrl })}
              type="url"
            />
            <Field
              label="Thumbnail URL"
              value={draft.thumbnailUrl}
              onChange={(thumbnailUrl) => setDraft({ ...draft, thumbnailUrl })}
              type="url"
            />
            <Field
              label="Duration"
              value={draft.duration}
              onChange={(duration) => setDraft({ ...draft, duration })}
              placeholder="42 min"
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="video-quote">Quote</Label>
            <Textarea
              id="video-quote"
              value={draft.quote}
              onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
              rows={3}
              className="mt-1.5"
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="video-description">Description</Label>
            <Textarea
              id="video-description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Publish video
            </Button>
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
          </div>
        </form>

        <aside className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl text-primary">Published videos</h2>
          <div className="mt-5 space-y-4">
            {videos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No Firestore interview videos yet.</p>
            ) : (
              videos.map((video) => (
                <article key={video.id} className="border-b border-border pb-4 last:border-0">
                  <p className="font-semibold text-primary">{video.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {video.guestName} · {video.type}
                  </p>
                </article>
              ))
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

function AdminState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-lg border border-border bg-card p-8">
        <div className="text-accent">{icon}</div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-accent">Admin</p>
        <h1 className="mt-3 font-serif text-4xl text-primary">{title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{body}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="text-accent">{icon}</div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-4xl text-primary">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5"
      />
    </div>
  );
}
