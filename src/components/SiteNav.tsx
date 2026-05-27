import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Atom, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/use-auth-user";
import { getDisplayName, signOutUser } from "@/lib/auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/resources", label: "Resources" },
  { to: "/history", label: "History" },
  { to: "/community", label: "Community" },
  { to: "/interviews", label: "Interviews" },
];

function AuthNavItem({ onNavigate }: { onNavigate?: () => void }) {
  const { user, loading } = useAuthUser();

  if (loading) {
    return null;
  }

  if (user) {
    async function handleSignOut() {
      await signOutUser();
      onNavigate?.();
    }

    return (
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-sm text-muted-foreground">
          Signed in as{" "}
          <span className="font-medium text-foreground">{getDisplayName(user)}</span>
        </span>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="mr-1 h-4 w-4" />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button
      asChild
      size="sm"
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Link to="/signin" onClick={onNavigate}>
        Sign in
      </Link>
    </Button>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold text-primary"
        >
          <Atom className="h-6 w-6 text-accent" />
          <span>HerSTEM</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary [&.active]:text-primary [&.active]:underline [&.active]:decoration-accent [&.active]:decoration-2 [&.active]:underline-offset-8"
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <AuthNavItem />
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2">
              <AuthNavItem onNavigate={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
