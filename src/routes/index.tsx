import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import heroCellist from "../assets/hero-cellist.jpg";
import lessonMaterials from "../assets/lesson-materials.jpg";
import performanceHighlight from "../assets/performance-highlight.jpg";
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
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero / Discovery Section */}
      <section className="px-6 md:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-8">
              Master the <span className="italic text-gold">Art</span> of Sound.
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mb-10 leading-relaxed">
              Join a premium community of musicians. From foundational theory to advanced performance technique.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/classes"
                className="px-8 py-4 bg-gold text-onyx font-bold uppercase text-xs tracking-widest hover:bg-foreground transition-all"
              >
                Explore Catalog
              </Link>
              <Link
                to="/instructors"
                className="px-8 py-4 border border-white/10 text-foreground font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
              >
                View Faculty
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroCellist}
              alt="Professional cellist performing in a moody dark studio"
              width={800}
              height={1000}
              className="w-full aspect-[4/5] object-cover bg-slate-custom outline outline-1 -outline-offset-1 outline-white/5 rounded-sm"
            />
            <div className="absolute -bottom-6 -left-6 bg-gold p-6 md:p-8 hidden md:block max-w-xs">
              <p className="text-onyx font-serif italic text-xl md:text-2xl">
                "Music is the silence between the notes."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Dashboard Snippet */}
      <section className="bg-slate-custom/30 py-24 border-y border-white/5">
        <div className="px-6 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-gold mb-2 font-bold">
                Personal Campus
              </h2>
              <h3 className="text-4xl font-serif">Welcome back, Julian.</h3>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-serif text-gold">14</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Day Streak
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-serif text-gold">85%</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Theory Mastery
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Next Lesson */}
            <div className="bg-background p-8 border border-white/5 rounded-sm">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Next Lesson
              </span>
              <h4 className="text-xl mt-4 mb-2 font-serif">Advanced Jazz Improv</h4>
              <p className="text-muted-foreground text-sm mb-6">
                Today at 4:30 PM with Dr. Aris Thorne
              </p>
              <img
                src={lessonMaterials}
                alt="Sheet music on a dark piano"
                width={1024}
                height={512}
                loading="lazy"
                className="w-full h-32 object-cover bg-slate-custom mb-6"
              />
              <Link
                to="/dashboard"
                className="block w-full text-center py-3 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all"
              >
                Join Digital Studio
              </Link>
            </div>

            {/* Milestone */}
            <div className="bg-background p-8 border border-white/5 rounded-sm">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Milestones
              </span>
              <div className="mt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rhythm Basics</span>
                  <span className="text-[10px] text-gold border border-gold/30 px-2 py-0.5">
                    COMPLETED
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Chord Progressions</span>
                  <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gold w-[65%]"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center opacity-40">
                  <span className="text-sm">Solo Composition</span>
                  <span className="text-[10px] uppercase">Locked</span>
                </div>
              </div>
            </div>

            {/* Performance Highlight */}
            <div className="bg-background border border-white/5 rounded-sm overflow-hidden flex flex-col">
              <img
                src={performanceHighlight}
                alt="Cinematic stage lighting and microphone"
                width={1200}
                height={800}
                loading="lazy"
                className="w-full aspect-video object-cover bg-slate-custom"
              />
              <div className="p-6">
                <h4 className="font-serif text-lg">Winter Showcase Highlights</h4>
                <p className="text-muted-foreground text-xs mt-2">
                  Watch the best moments from last night's live performance at The Grand Hall.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="px-6 md:px-8 py-24 max-w-7xl mx-auto text-center">
        <h2 className="text-xs uppercase tracking-[0.4em] text-gold mb-8 font-bold">
          The Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/gallery">
            <img
              src={galleryPiano}
              alt="Hands playing a grand piano"
              width={512}
              height={512}
              loading="lazy"
              className="aspect-square object-cover bg-slate-custom opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            />
          </Link>
          <Link to="/gallery">
            <img
              src={galleryViolinist}
              alt="Violinist during a masterclass"
              width={512}
              height={512}
              loading="lazy"
              className="aspect-square object-cover bg-slate-custom opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            />
          </Link>
          <Link to="/gallery">
            <img
              src={galleryDrums}
              alt="Drum kit in a recording studio"
              width={512}
              height={512}
              loading="lazy"
              className="aspect-square object-cover bg-slate-custom opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            />
          </Link>
          <Link to="/gallery">
            <img
              src={galleryStudents}
              alt="Students laughing in a music lounge"
              width={512}
              height={512}
              loading="lazy"
              className="aspect-square object-cover bg-slate-custom opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            />
          </Link>
        </div>
        <Link
          to="/gallery"
          className="inline-block mt-10 px-8 py-4 border border-white/10 text-foreground font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
        >
          View All Performances
        </Link>
      </section>

      <Footer />
    </div>
  );
}
