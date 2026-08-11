import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import galleryPiano from "../assets/gallery-piano.jpg";
import galleryViolinist from "../assets/gallery-violinist.jpg";
import galleryDrums from "../assets/gallery-drums.jpg";
import galleryStudents from "../assets/gallery-students.jpg";
import heroCellist from "../assets/hero-cellist.jpg";
import performanceHighlight from "../assets/performance-highlight.jpg";
import lessonMaterials from "../assets/lesson-materials.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Media Gallery — DonMusic" },
      { name: "description", content: "Watch highlights from DonMusic recitals, masterclasses, and live performances." },
      { property: "og:title", content: "Media Gallery — DonMusic" },
      { property: "og:description", content: "Watch highlights from DonMusic recitals, masterclasses, and live performances." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gallery,
});

const galleryItems = [
  { src: performanceHighlight, alt: "Cinematic stage lighting and microphone", span: "col-span-2 row-span-2" },
  { src: heroCellist, alt: "Professional cellist in a moody studio", span: "col-span-1 row-span-2" },
  { src: galleryPiano, alt: "Hands playing a grand piano", span: "col-span-1" },
  { src: galleryViolinist, alt: "Violinist during a masterclass", span: "col-span-1" },
  { src: galleryDrums, alt: "Drum kit in a recording studio", span: "col-span-1" },
  { src: galleryStudents, alt: "Students laughing in a music lounge", span: "col-span-2" },
  { src: lessonMaterials, alt: "Sheet music on a dark piano", span: "col-span-2" },
];

function Gallery() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <section className="px-6 md:px-8 py-16 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-gold mb-4 font-bold">
            The Digital Venue
          </h2>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] mb-6">
            Moments from the <span className="italic text-gold">Stage</span>.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Recitals, masterclasses, and behind-the-scenes highlights from the DonMusic community.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-sm ${item.span}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover bg-slate-custom opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
