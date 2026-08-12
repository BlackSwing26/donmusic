import { Link, useRouterState } from "@tanstack/react-router";

const navLinks = [
  { to: "/classes", label: "Classes" },
  { to: "/instructors", label: "Instructors" },
  { to: "/gallery", label: "Gallery" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const { location } = useRouterState();
  const currentPath = location.pathname;

  return (
    <nav className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-white/5">
      <Link to="/" className="text-2xl font-serif italic tracking-tight text-gold">
        DonMusic
      </Link>
      <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-medium text-muted-foreground">
        {navLinks.map((link) => {
          const isActive = currentPath === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={
                isActive
                  ? "text-foreground border-b border-gold pb-0.5 transition-colors"
                  : "hover:text-gold transition-colors"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors">
          Sign In
        </Link>
        <div className="size-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold uppercase cursor-pointer">
          JD
        </div>
      </div>
    </nav>
  );
}
