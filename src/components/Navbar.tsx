import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

const publicNavLinks = [
  { to: "/classes", label: "Classes" },
  { to: "/instructors", label: "Instructors" },
  { to: "/gallery", label: "Gallery" },
];

export function Navbar() {
  const { location } = useRouterState();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUserRole(data.role);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUserRole(data.role);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const dashboardLink = userRole === 'admin' ? '/admin' : userRole === 'teacher' ? '/teacher' : '/dashboard';

  return (
    <nav className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-white/5 bg-background">
      <Link to="/" className="text-2xl font-serif italic tracking-tight text-gold">
        DonMusic
      </Link>
      
      <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-medium text-muted-foreground items-center">
        {publicNavLinks.map((link) => {
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
        {session && (
          <Link
            to={dashboardLink}
            className={
              currentPath === dashboardLink
                ? "text-foreground border-b border-gold pb-0.5 transition-colors"
                : "hover:text-gold transition-colors text-gold"
            }
          >
            Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Loading...</div>
        ) : session ? (
          <>
            <button 
              onClick={handleLogout}
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-red-400 transition-colors"
            >
              Log Out
            </button>
            <Link to={dashboardLink}>
              <div className="size-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold uppercase cursor-pointer hover:bg-gold hover:text-onyx transition-all">
                {session.user.email?.charAt(0).toUpperCase()}
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="text-xs uppercase tracking-widest bg-gold text-onyx px-4 py-2 font-bold hover:bg-gold/90 transition-colors">
              Apply
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
