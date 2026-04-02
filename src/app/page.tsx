"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCarousel } from "@/components/layout/ProductCarousel";
import { Footer } from "@/components/layout/Footer";
import new_releases from "../../public/batman1.png";
import ebay_store from "../../public/comicsbg.png";
import cgc_comics from "../../public/cgc.png";
import { useRef, useState } from "react";

const TRANSLATE_STRENGTH = 5;
const IMAGE_OVERFLOW = 30;

function ParallaxImage({
  src,
  alt,
  href,
  priority,
  caption,
  heading,
  buttonLabel,
  headingSize = "text-3xl",
}: {
  src: any;
  alt: string;
  href: string;
  priority?: boolean;
  caption?: string;
  heading?: string;
  buttonLabel?: string;
  headingSize?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    const relX = (e.clientX - rect.right) / rect.width - 0.5;
    setTranslate({
      x: -relX * TRANSLATE_STRENGTH,
      y: -relY * TRANSLATE_STRENGTH,
    });
  };

  const handleMouseLeave = () => {
    setTranslate({ x: 0, y: 0 });
    setActive(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Image layer */}
      <div
        style={{
          position: "absolute",
          inset: -IMAGE_OVERFLOW,
          transition: "transform 0.5s ease-out",
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${active ? 1.04 : 1})`,
          willChange: "transform",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 rounded-2xl" />

      {/* Text + button */}
      <div className="absolute bottom-1 left-1 z-20 p-5 flex flex-col gap-2">
        {heading && (
          <h2 className={`text-white ${headingSize} font-bold drop-shadow mb`}>
            {heading}
          </h2>
        )}
        {caption && <p className="text-white/80 text-sm">{caption}</p>}
        {buttonLabel && (
          <Link
            href={href}
            className="mt-1 w-fit px-5 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded-md transition-colors duration-200"
          >
            {buttonLabel}
          </Link>
        )}
      </div>

      {/* Full clickable area */}
      <Link href={href} className="absolute inset-0 z-10" aria-label={alt} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center z-0">
      {/* Hero */}
      <div className="w-full h-[500px] flex flex-row p-8 gap-4 bg-black">
        <div className="w-1/2 h-full">
          <ParallaxImage
            src={new_releases}
            alt="New Releases"
            href="/new-releases"
            priority
            caption="Check out the newest wave of comics"
            heading="New Releases"
            buttonLabel="Explore"
            headingSize="text-4xl"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col items-center gap-4">
          <div className="w-full h-1/2">
            <ParallaxImage
              src={ebay_store}
              alt="eBay Store"
              href="https://www.ebay.com/str/ccs1comics"
              caption="Explore our wider selection"
              heading="eBay Store"
              buttonLabel="Visit"
            />
          </div>
          <div className="w-full h-1/2">
            <ParallaxImage
              src={cgc_comics}
              alt="CGC Comics"
              href="https://shortboxed.com/u/heroes_and_champions_comics"
              caption="CGC comics for your collectible taste"
              heading="Graded Comics"
              buttonLabel="Explore"
            />
          </div>
        </div>
      </div>

      {/* Product Shelves */}
      <div className="w-full max-w-screen-2xl flex flex-col items-center px-8">
        <ProductCarousel title="Featured Comics" category="comic" />
        <ProductCarousel title="Trading Cards" category="trading cards" />
        <ProductCarousel title="DC Comics" category="comic" />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
