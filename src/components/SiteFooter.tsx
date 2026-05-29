import { Link } from "@tanstack/react-router";
import { Atom } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[#31566a] text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-serif text-2xl">
            <Atom className="h-6 w-6 text-accent" /> HerSTEM
          </div>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/75">
            A platform built to celebrate, empower, and connect women in Science, Technology, Engineering &amp; Mathematics.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-accent">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/history">History</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/interviews">Interviews</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-accent">Account</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/signin">Sign in</Link></li>
            <li><Link to="/about">About us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-6 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} HerSTEM. Built for the next generation of innovators.
      </div>
    </footer>
  );
}
