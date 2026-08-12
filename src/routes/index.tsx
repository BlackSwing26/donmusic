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
