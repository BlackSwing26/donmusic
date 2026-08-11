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

        <div className="grid md:grid-cols-2 gap-8">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="group bg-slate-custom/30 border border-white/5 rounded-sm overflow-hidden flex flex-col md:flex-row"
            >
              <img
                src={instructor.image}
                alt={instructor.alt}
                width={400}
                height={500}
                loading="lazy"
                className="w-full md:w-48 aspect-square md:aspect-auto object-cover bg-slate-custom"
              />
              <div className="p-8 flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold mb-2">
                  {instructor.role}
                </p>
                <h3 className="text-2xl font-serif mb-3">{instructor.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {instructor.bio}
                </p>
                <Link
                  to="/classes"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gold hover:text-foreground transition-colors"
                >
                  View Classes
                  <svg
                    className="ml-2 size-3"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.69 8 6.22 5.53a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
