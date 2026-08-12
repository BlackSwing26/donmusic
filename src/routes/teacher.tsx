import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";

export const Route = createFileRoute("/teacher")({
  component: TeacherDashboard,
});

function TeacherDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Instructor");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate({ to: "/login" });
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', session.user.id)
        .single();
        
      if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
        navigate({ to: "/dashboard" });
        return;
      }
      
      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading faculty portal...</div>;
  }

  return (
    <AppLayout role="teacher" title="Faculty Portal">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl">Welcome, {userName}.</h1>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">3</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                My Classes
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">24</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                My Students
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Class Rosters */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Student Management
            </span>
            <h3 className="text-xl mt-4 mb-2 font-serif">Class Rosters</h3>
            <p className="text-muted-foreground text-sm mb-6">
              View your enrolled students, monitor their practice logs, and communicate.
            </p>
            <button className="w-full py-3 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all">
              View Students
            </button>
          </div>

          {/* Assignments */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Coursework
            </span>
            <h3 className="text-xl mt-4 mb-2 font-serif">Manage Assignments</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Create new assignments, upload sheet music, and track submissions.
            </p>
            <button className="w-full py-3 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all">
              View Assignments
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
