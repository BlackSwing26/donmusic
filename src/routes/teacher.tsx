import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/teacher")({
  component: TeacherDashboard,
});

function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <section className="px-6 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gold mb-2 font-bold">
              Faculty Portal
            </h2>
            <h1 className="font-serif text-4xl md:text-5xl">Welcome, Instructor.</h1>
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
      </section>

      <Footer />
    </div>
  );
}
