import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <section className="px-6 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gold mb-2 font-bold">
              Admin Portal
            </h2>
            <h1 className="font-serif text-4xl md:text-5xl">Global Overview</h1>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">42</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Total Students
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">8</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Faculty
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-gold">12</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Active Classes
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* User Management */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              User Management
            </span>
            <h3 className="text-xl mt-4 mb-2 font-serif">Manage Roles & Accounts</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Promote students to teachers, update fee balances, and manage access.
            </p>
            <button className="w-full py-3 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all">
              Open User Directory
            </button>
          </div>

          {/* Catalog Management */}
          <div className="bg-slate-custom/30 p-8 border border-white/5 rounded-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Catalog Management
            </span>
            <h3 className="text-xl mt-4 mb-2 font-serif">Manage Classes</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Add new classes, assign teachers, and edit existing catalog details.
            </p>
            <button className="w-full py-3 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all">
              Manage Catalog
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
