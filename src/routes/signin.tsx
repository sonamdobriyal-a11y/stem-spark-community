import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Atom, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signin")({ component: SignIn });

function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="mx-auto grid min-h-[calc(100vh-200px)] max-w-6xl gap-8 px-6 py-12 md:grid-cols-2 md:items-center">
      {/* Left panel */}
      <div className="hidden rounded-3xl bg-primary p-12 text-primary-foreground md:block">
        <Atom className="h-10 w-10 text-accent" />
        <h2 className="mt-6 font-serif text-4xl leading-tight">Your journey in STEM, supported.</h2>
        <p className="mt-4 text-primary-foreground/80">
          Join thousands of women learning together — save resources, post in the community, and follow stories that move you.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-primary-foreground/80">
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Personalized resource library</li>
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Post &amp; comment in the community</li>
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Connect with mentors and peers</li>
        </ul>
      </div>

      {/* Form */}
      <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
        <div className="mb-6 inline-flex rounded-full bg-secondary p-1">
          <button onClick={() => setMode("signin")} className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${mode === "signin" ? "bg-primary text-primary-foreground" : "text-foreground/70"}`}>Sign in</button>
          <button onClick={() => setMode("signup")} className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-foreground/70"}`}>Create account</button>
        </div>

        <h1 className="font-serif text-3xl text-primary">{mode === "signin" ? "Welcome back" : "Join HerSTEM"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mode === "signin" ? "Sign in to continue your journey." : "It only takes a minute."}</p>

        <form className="mt-7 space-y-4" onSubmit={(e) => e.preventDefault()}>
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" placeholder="Your name" className="pl-9" />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@example.com" className="pl-9" />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-9" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full">Continue with Google</Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}
