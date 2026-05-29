import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { Atom, LogOut, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAccountWithEmail,
  getAuthErrorMessage,
  getDisplayName,
  isAdminUser,
  signInWithEmail,
  signOutUser,
} from "@/lib/auth";
import { useAuthUser } from "@/hooks/use-auth-user";

export const Route = createFileRoute("/signin")({ component: SignIn });

function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading, isConfigured } = useAuthUser();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("");

    if (!isConfigured) {
      setStatus("Sign-in is unavailable right now.");
      return;
    }

    if (!form.email.trim() || !form.password) {
      setStatus("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        await createAccountWithEmail(form.name, form.email.trim(), form.password);
      } else {
        await signInWithEmail(form.email.trim(), form.password);
      }
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Authentication failed", error);
      setStatus(getAuthErrorMessage(error, mode));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-200px)] max-w-6xl gap-8 px-6 py-12 md:grid-cols-2 md:items-center">
      <div className="hidden rounded-3xl bg-[#31566a] p-12 text-primary-foreground md:block">
        <Atom className="h-10 w-10 text-accent" />
        <h2 className="mt-6 font-serif text-4xl leading-tight">Your journey in STEM, supported.</h2>
        <p className="mt-4 text-primary-foreground/80">
          Join thousands of women learning together — save resources, post in the community, and
          follow stories that move you.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-primary-foreground/80">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Personalized resource library
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Post &amp; comment in the
            community
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Connect with mentors and peers
          </li>
        </ul>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
        {loading ? (
          <p className="text-sm text-muted-foreground">Checking your session...</p>
        ) : user ? (
          <SignedInPanel user={user} />
        ) : (
          <>
            <div className="mb-6 inline-flex rounded-full bg-secondary p-1">
              <button
                onClick={() => setMode("signin")}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${
                  mode === "signin" ? "bg-primary text-primary-foreground" : "text-foreground/70"
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${
                  mode === "signup" ? "bg-primary text-primary-foreground" : "text-foreground/70"
                }`}
              >
                Create account
              </button>
            </div>

            <h1 className="font-serif text-3xl text-primary">
              {mode === "signin" ? "Welcome back" : "Join HerSTEM"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin" ? "Sign in to continue your journey." : "It only takes a minute."}
            </p>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Your name"
                      className="pl-9"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="pl-9"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>

            {status && <p className="mt-4 text-sm text-destructive">{status}</p>}

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing you agree to our Terms &amp; Privacy Policy.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function SignedInPanel({ user }: { user: FirebaseUser }) {
  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">You are signed in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Signed in as {getDisplayName(user)}
        {user.email ? ` (${user.email})` : ""}.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/community">Go to community</Link>
        </Button>
        {isAdminUser(user) && (
          <Button asChild variant="outline">
            <Link to="/admin">Open admin</Link>
          </Button>
        )}
        <Button variant="outline" onClick={() => signOutUser()}>
          <LogOut className="mr-1 h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );
}
