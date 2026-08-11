import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import galleryPiano from "../assets/gallery-piano.jpg";
import galleryViolinist from "../assets/gallery-violinist.jpg";
import galleryDrums from "../assets/gallery-drums.jpg";
import heroCellist from "../assets/hero-cellist.jpg";
import performanceHighlight from "../assets/performance-highlight.jpg";
import galleryStudents from "../assets/gallery-students.jpg";

export const Route = createFileRoute("/classes")({
  head: () => ({
    meta: [
      { title: "Class Catalog — DonMusic" },
      { name: "description", content: "Browse DonMusic's rich catalog of music classes, from beginner theory to advanced jazz and composition." },
      { property: "og:title", content: "Class Catalog — DonMusic" },
      { property: "og:description", content: "Browse DonMusic's rich catalog of music classes, from beginner theory to advanced jazz and composition." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Classes,
});

const categories = ["All", "Strings", "Piano", "Jazz", "Vocals", "Production"];

const classes = [
  {
    id: 1,
    title: "Foundations of Cello",
    category: "Strings",
    level: "Beginner",
    duration: "8 Weeks • 12h 40m",
    price: "$450",
    image: heroCellist,
    alt: "Cellist performing in a moody studio",
  },
  {
    id: 2,
    title: "Advanced Jazz Improvisation",
    category: "Jazz",
    level: "Advanced",
    duration: "12 Weeks • 18h 20m",
    price: "$620",
    image: performanceHighlight,
    alt: "Cinematic stage lighting and microphone",
  },
  {
    id: 3,
    title: "Modern Composition & Scoring",
    category: "Production",
    level: "Intermediate",
    duration: "10 Weeks • 15h 10m",
    price: "$580",
    image: galleryPiano,
    alt: "Hands playing a grand piano",
  },
  {
    id: 4,
    title: "Violin Masterclass",
    category: "Strings",
    level: "Intermediate",
    duration: "6 Weeks • 9h 30m",
    price: "$390",
    image: galleryViolinist,
    alt: "Violinist during a masterclass",
  },
  {
    id: 5,
    title: "Drum Kit Fundamentals",
    category: "Drums",
    level: "Beginner",
    duration: "8 Weeks • 11h 00m",
    price: "$420",
    image: galleryDrums,
    alt: "Drum kit in a recording studio",
  },
  {
    id: 6,
    title: "Vocal Performance & Technique",
    category: "Vocals",
    level: "All Levels",
    duration: "8 Weeks • 12h 15m",
    price: "$480",
    image: galleryStudents,
    alt: "Students in a music lounge",
  },
];

function Classes() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredClasses =
    activeCategory === "All"
      ? classes
      : classes.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <section className="px-6 md:px-8 py-16 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2 className="text-xs uppercase tracking-[0.3em] text-gold mb-4 font-bold">
            Curriculum
          </h2>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] mb-6">
            Explore the <span className="italic text-gold">Catalog</span>.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Structured paths for every discipline, from first notes to professional performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={
                activeCategory === category
                  ? "px-5 py-2 bg-gold text-onyx text-xs font-bold uppercase tracking-widest transition-all"
                  : "px-5 py-2 border border-white/10 text-foreground text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
              }
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((item) => (
            <Link
              key={item.id}
              to="/dashboard"
              className="group cursor-pointer block"
            >
              <img
                src={item.image}
                alt={item.alt}
                width={800}
                height={1000}
                loading="lazy"
                className="w-full aspect-[4/5] object-cover bg-slate-custom outline outline-1 -outline-offset-1 outline-white/5 rounded-sm mb-5 group-hover:opacity-90 transition-opacity"
              />
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold mb-1">
                {item.level}
              </p>
              <h3 className="text-xl font-serif group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-muted-foreground">{item.duration}</p>
                <span className="text-xs font-bold text-gold border border-gold/30 px-2 py-0.5">
                  {item.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
