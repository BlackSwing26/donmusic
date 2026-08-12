import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import lessonMaterials from "../assets/lesson-materials.jpg";
import performanceHighlight from "../assets/performance-highlight.jpg";
import galleryPiano from "../assets/gallery-piano.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const milestones = [
  { title: "Rhythm Basics", status: "completed", progress: 100 },
  { title: "Chord Progressions", status: "in-progress", progress: 65 },
  { title: "Solo Composition", status: "locked", progress: 0 },
  { title: "Ear Training II", status: "in-progress", progress: 42 },
];

const schedule = [
  { day: "Mon", time: "4:30 PM", title: "Advanced Jazz Improv", with: "Dr. Aris Thorne" },
  { day: "Wed", time: "6:00 PM", title: "Cello Technique Lab", with: "Elena Voss" },
  { day: "Fri", time: "5:00 PM", title: "Composition Workshop", with: "Marcus Reed" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Student");
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
        .select('full_name')
        .eq('id', session.user.id)
        .single();
        
      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading campus...</div>;
  }

  return (
    <AppLayout role="student" title="Personal Campus">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl">Welcome back, {userName}.</h1>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">14</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Day Streak
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">85%</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Theory Mastery
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">128</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Practice Hrs
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Next Lesson */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Next Lesson
            </span>
            <h3 className="text-xl mt-4 mb-2 font-serif">Advanced Jazz Improv</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Today at 4:30 PM with Dr. Aris Thorne
            </p>
            <img
              src={lessonMaterials}
              alt="Sheet music on a dark piano"
              className="w-full h-32 object-cover bg-slate-custom mb-6 rounded-sm"
            />
            <button className="w-full py-3 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all">
              Join Digital Studio
            </button>
          </div>

          {/* Milestones */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Milestones
            </span>
            <div className="mt-6 space-y-6">
              {milestones.map((milestone) => (
                <div key={milestone.title} className="flex justify-between items-center">
                  <span
                    className={
                      milestone.status === "locked" ? "text-sm opacity-40" : "text-sm"
                    }
                  >
                    {milestone.title}
                  </span>
                  {milestone.status === "completed" ? (
                    <span className="text-[10px] text-gold border border-gold/30 px-2 py-0.5 rounded-sm">
                      COMPLETED
                    </span>
                  ) : milestone.status === "locked" ? (
                    <span className="text-[10px] uppercase opacity-50">Locked</span>
                  ) : (
                    <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold"
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              This Week
            </span>
            <div className="mt-6 space-y-6">
              {schedule.map((session) => (
                <div key={session.title} className="flex gap-4">
                  <div className="text-center min-w-[3rem]">
                    <div className="text-xs font-bold text-gold uppercase">{session.day}</div>
                    <div className="text-[10px] text-muted-foreground">{session.time}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{session.title}</div>
                    <div className="text-xs text-muted-foreground">{session.with}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Replay */}
          <div className="bg-slate-custom/30 border border-white/5 rounded-sm overflow-hidden flex flex-col">
            <img
              src={performanceHighlight}
              alt="Cinematic stage lighting and microphone"
              className="w-full aspect-video object-cover bg-slate-custom"
            />
            <div className="p-6">
              <h3 className="font-serif text-lg">Winter Showcase Highlights</h3>
              <p className="text-muted-foreground text-xs mt-2">
                Watch the best moments from last night's live performance at The Grand Hall.
              </p>
            </div>
          </div>

          {/* Recommended Next */}
          <div className="bg-slate-custom/30 border border-white/5 rounded-sm overflow-hidden flex flex-col">
            <img
              src={galleryPiano}
              alt="Hands playing a grand piano"
              className="w-full aspect-video object-cover bg-slate-custom"
            />
            <div className="p-6">
              <h3 className="font-serif text-lg">Recommended: Composition Workshop</h3>
              <p className="text-muted-foreground text-xs mt-2">
                Based on your progress, this workshop will strengthen your harmonic vocabulary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
