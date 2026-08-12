import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Users, Music, MonitorPlay, ChevronRight, Quote } from "lucide-react";

import heroCellist from "../assets/hero-cellist.jpg";
import galleryPiano from "../assets/gallery-piano.jpg";
import galleryViolinist from "../assets/gallery-violinist.jpg";
import galleryDrums from "../assets/gallery-drums.jpg";
import galleryStudents from "../assets/gallery-students.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DonMusic — Premium Digital Music Campus" },
      { name: "description", content: "Discover classes, expert instructors, and a personalized student dashboard at DonMusic." },
      { property: "og:title", content: "DonMusic — Premium Digital Music Campus" },
      { property: "og:description", content: "Discover classes, expert instructors, and a personalized student dashboard at DonMusic." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-gold selection:text-onyx overflow-x-hidden">
      <Navbar />

      {/* 1. The Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-48 px-6 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
          </span>
          Enrollment Now Open
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Master the <span className="italic text-gold">Art</span> of Sound.
        </h1>
        
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Join a premium community of musicians. From foundational theory to advanced performance technique, taught by world-class faculty.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link
            to="/classes"
            className="px-8 py-4 bg-gold text-onyx font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group"
          >
            Explore Catalog
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/signup"
            className="px-8 py-4 border border-white/10 text-foreground font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all flex items-center justify-center"
          >
            Become a Student
          </Link>
        </div>
      </section>

      {/* 2. Why DonMusic? (Value Proposition) */}
      <section className="border-y border-white/5 bg-slate-custom/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-16 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center text-gold mb-2">
                <Users className="size-6" />
              </div>
              <h3 className="font-serif text-2xl">World-Class Faculty</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Learn directly from touring professionals, conservatory alumni, and industry veterans.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-16 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center text-gold mb-2">
                <MonitorPlay className="size-6" />
              </div>
              <h3 className="font-serif text-2xl">Interactive Campus</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Our bespoke digital dashboards keep your lessons, assignments, and schedule perfectly organized.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-16 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center text-gold mb-2">
                <Music className="size-6" />
              </div>
              <h3 className="font-serif text-2xl">Personalized Curriculum</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                From classical piano to jazz improvisation, our classes adapt to your unique musical goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Disciplines */}
      <section className="px-6 md:px-8 py-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-4">
              The Disciplines
            </h2>
            <h3 className="font-serif text-4xl md:text-5xl">Find Your Instrument</h3>
          </div>
          <Link 
            to="/classes" 
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors flex items-center gap-2"
          >
            View Full Catalog <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/classes" className="group relative block aspect-[3/4] overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img src={galleryPiano} alt="Piano" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" loading="lazy" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <h4 className="font-serif text-2xl mb-1 group-hover:text-gold transition-colors">Piano</h4>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Classical & Contemporary</p>
            </div>
          </Link>
          
          <Link to="/classes" className="group relative block aspect-[3/4] overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img src={galleryViolinist} alt="Violin" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" loading="lazy" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <h4 className="font-serif text-2xl mb-1 group-hover:text-gold transition-colors">Strings</h4>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Violin, Viola, Cello</p>
            </div>
          </Link>
          
          <Link to="/classes" className="group relative block aspect-[3/4] overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img src={galleryDrums} alt="Drums" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" loading="lazy" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <h4 className="font-serif text-2xl mb-1 group-hover:text-gold transition-colors">Percussion</h4>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Drum Kit & Orchestral</p>
            </div>
          </Link>

          <Link to="/classes" className="group relative block aspect-[3/4] overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img src={heroCellist} alt="Masterclass" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" loading="lazy" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <h4 className="font-serif text-2xl mb-1 group-hover:text-gold transition-colors">Masterclasses</h4>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Advanced Technique</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Social Proof / Testimonial */}
      <section className="py-24 bg-black/50 border-y border-white/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center relative z-10">
          <Quote className="size-12 text-gold/30 mx-auto mb-8" />
          <p className="font-serif text-2xl md:text-4xl leading-relaxed mb-10 text-white/90 italic">
            "DonMusic completely transformed my approach to the cello. The instructors didn't just teach me notes—they taught me how to listen, how to interpret, and how to truly perform."
          </p>
          <div className="flex items-center justify-center gap-4">
            <img 
              src={galleryStudents} 
              alt="Elena Rostova" 
              className="size-12 rounded-full object-cover border border-white/10" 
            />
            <div className="text-left">
              <div className="text-sm font-bold text-gold uppercase tracking-wider">Elena Rostova</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">Alumni & Concert Cellist</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final Call-to-Action */}
      <section className="py-32 px-6 md:px-8 max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
          Ready to <span className="italic text-gold">Begin?</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
          Join hundreds of students mastering their craft. Create your account today to access the full catalog and book your first lesson.
        </p>
        <Link
          to="/signup"
          className="inline-flex px-10 py-5 bg-gold text-onyx font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all rounded-sm items-center gap-2"
        >
          Start Your Journey <ChevronRight className="w-4 h-4" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}

