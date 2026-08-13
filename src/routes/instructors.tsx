import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import heroCellist from "../assets/hero-cellist.jpg";
import galleryViolinist from "../assets/gallery-violinist.jpg";
import galleryDrums from "../assets/gallery-drums.jpg";
import galleryStudents from "../assets/gallery-students.jpg";

export const Route = createFileRoute("/instructors")({
  head: () => ({
    meta: [
      { title: "Instructors — DonMusic" },
      { name: "description", content: "Meet DonMusic's world-class instructors and find the perfect mentor for your musical journey." },
      { property: "og:title", content: "Instructors — DonMusic" },
      { property: "og:description", content: "Meet DonMusic's world-class instructors and find the perfect mentor for your musical journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Instructors,
});

const instructors = [
  {
    id: 1,
    name: "Dr. Aris Thorne",
    role: "Jazz & Improvisation",
    bio: "Former Berklee faculty with two decades guiding performers through the language of jazz.",
    image: heroCellist,
    alt: "Dr. Aris Thorne portrait",
  },
  {
    id: 2,
    name: "Elena Voss",
    role: "Strings Department Chair",
    bio: "Concert violinist and dedicated pedagogue specializing in bow technique and chamber coaching.",
    image: galleryViolinist,
    alt: "Elena Voss portrait",
  },
  {
    id: 3,
    name: "Marcus Reed",
    role: "Drums & Rhythm",
    bio: "Session drummer and groove architect who breaks down complex rhythms into intuitive practice.",
    image: galleryDrums,
    alt: "Marcus Reed portrait",
  },
  {
    id: 4,
    name: "Sofia Bellamy",
    role: "Vocal Performance",
    bio: "Opera-trained vocalist helping students find power, control, and emotional truth in every phrase.",
    image: galleryStudents,
    alt: "Sofia Bellamy portrait",
  },
];

function Instructors() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <section className="px-6 md:px-8 py-16 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-gold mb-4 font-bold">
            Faculty
          </h2>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] mb-6">
            Learn from the <span className="italic text-gold">Masters</span>.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our instructors are active performers, composers, and educators committed to your growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {instructors.map((instructor) => (
            <Link
              key={instructor.id}
              to="/classes"
              className="group block"
            >
              <div className="overflow-hidden rounded-sm mb-6 relative border border-white/5">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                <img
                  src={instructor.image}
                  alt={instructor.alt}
                  width={400}
                  height={500}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover bg-slate-custom transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-serif mb-2 group-hover:text-gold transition-colors">{instructor.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                  {instructor.role}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
