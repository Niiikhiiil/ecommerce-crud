import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGES } from "../assets/data";

function Carousel() {
  const [index, setIndex] = useState(0);

  const prevImage = () => {
    setIndex((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative h-72 sm:h-96 rounded-lg overflow-hidden shadow-lg bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${IMAGES[index]})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Left Button */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow z-10"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right Button */}
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow z-10"
      >
        <ChevronRight size={28} />
      </button>

      {/* Text Content Overlay (optional) */}
      <div className="absolute bottom-4 left-4 text-white z-10">
        <h2 className="text-xl font-semibold">Featured Products</h2>
        <p className="text-sm">Swipe using arrows</p>
      </div>
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-gray-400/60"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
