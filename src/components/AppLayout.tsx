import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";

interface AppLayoutProps {
  children: ReactNode;
  role?: "student" | "teacher" | "admin";
  title?: string;
}

export function AppLayout({ children, role = "student", title = "Dashboard" }: AppLayoutProps) {
  const { location } = useRouterState();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.full_name) {
              setUserName(data.full_name.split(" ")[0]);
            }
          });
          
        supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("receiver_id", session.user.id)
          .eq("is_read", false)
          .then(({ count }) => {
            setHasUnreadMessages((count || 0) > 0);
          });
      }
    });
  }, [currentPath]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const getLinks = () => {
    switch (role) {
      case "admin":
        return [
          { to: "/admin", label: "Overview" },
          { to: "/classes", label: "Catalog" },
          { to: "/messages", label: "Messages" },
        ];
      case "teacher":
        return [
          { to: "/teacher", label: "My Classes" },
          { to: "/instructors", label: "Faculty Directory" },
          { to: "/messages", label: "Messages" },
        ];
      default: // student
        return [
          { to: "/dashboard", label: "My Campus" },
          { to: "/classes", label: "Browse Classes" },
          { to: "/messages", label: "Messages" },
        ];
    }
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-custom/30 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between">
        <div className="p-6 md:p-8">
          <Link to="/" className="text-2xl font-serif italic tracking-tight text-gold block mb-12">
            DonMusic
          </Link>

          <nav className="space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
              {role} Menu
            </div>
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-2 rounded-sm text-sm font-medium transition-colors flex items-center justify-between ${
                  currentPath === link.to
                    ? "bg-gold text-onyx"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <span>{link.label}</span>
                {link.to === "/messages" && hasUnreadMessages && (
                  <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 md:p-8 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold uppercase">
              {userName.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium">{userName}</div>
              <div className="text-xs text-muted-foreground capitalize">{role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 border border-white/10 text-muted-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-red-900/30 hover:text-red-400 transition-all rounded-sm"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 flex items-center px-6 md:px-10">
          <h1 className="font-serif text-2xl">{title}</h1>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
