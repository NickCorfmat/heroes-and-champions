"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCarousel } from "@/components/layout/ProductCarousel";
import { Footer } from "@/components/layout/Footer";
import new_releases from "../../public/batman1.png";
import ebay_store from "../../public/comicsbg.png";
import cgc_comics from "../../public/cgc.png";
import { useRef, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

const TRANSLATE_STRENGTH = 5;
const IMAGE_OVERFLOW = 30;

function ParallaxImage({ src, alt, href, priority }: { src: any; alt: string; href: string; priority?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    const relX = (e.clientX - rect.right) / rect.width - 0.5;
    setTranslate({ x: -relX * TRANSLATE_STRENGTH, y: -relY * TRANSLATE_STRENGTH });
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
      <Link href={href} className="absolute inset-0 z-10" aria-label={alt} />
      <div
        style={{
          position: "absolute",
          inset: -IMAGE_OVERFLOW,
          transition: active ? "transform 0.5s ease-out" : "transform 0.5s ease-out",
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
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center z-0">
      { /* Hero */}
      <div className="w-full h-[500px] flex flex-row p-8 gap-4 bg-black">
        <div className="w-1/2 h-full">
          <ParallaxImage src={new_releases} alt="New Releases" href="/new-releases" priority />
        </div>
        <div className="w-1/2 h-full flex flex-col items-center gap-4">
          <div className="w-full h-1/2">
            <ParallaxImage src={ebay_store} alt="eBay Store" href="/ebay-store" />
          </div>
          <div className="w-full h-1/2">
            <ParallaxImage src={cgc_comics} alt="CGC Comics" href="/cgc-comics" />
          </div>
        </div>
      </div>

      {/* Product Shelves */}
      <div className="w-full flex flex-col items-center z-0 px-8">
        <ProductCarousel title="Featured Comics" category="comic"></ProductCarousel>
        <ProductCarousel title="Featured Comics" category="comic"></ProductCarousel>
        <ProductCarousel title="Featured Comics" category="comic"></ProductCarousel>
      </div>

      { /* Footer */ }
      <Footer></Footer>
    </div>
  );
}