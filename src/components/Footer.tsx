import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <Link to="/" className="font-serif text-xl italic tracking-tight text-gold">
            DonMusic
          </Link>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DonMusic Digital Campus. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Link to="/classes" className="hover:text-gold transition-colors">
            Classes
          </Link>
          <Link to="/instructors" className="hover:text-gold transition-colors">
            Instructors
          </Link>
          <Link to="/gallery" className="hover:text-gold transition-colors">
            Gallery
          </Link>
          <Link to="/dashboard" className="hover:text-gold transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
