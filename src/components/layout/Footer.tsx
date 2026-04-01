import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";

const FOOTER_SECTIONS = [
  {
    heading: "Quick Links",
    items: [
      { label: "Home", href: "/" },
      { label: "New Releases", href: "/new-releases" },
      { label: "Shop All", href: "/shop" },
      { label: "Sell / Trade", href: "/sell-trade" },
      { label: "About", href: "/about" },
    ],
  },
  {
    heading: "Locations",
    items: [
      { label: "Sunnyvale Store", href: "/locations/sunnyvale", address: "574 E El Camino Real, Sunnyvale, CA 94087", phone: "(408) 732-8775" },
      { label: "Willow Glen Store", href: "/locations/willow-glen", address: "2050 Lincoln Ave, San Jose, CA 95125", phone: "(408) 266-1103" },
    ],
  },
  {
    heading: "Contact",
    items: [
      { label: "heroesandchampions@gmail.com", href: "mailto:heroesandchampions@gmail.com" },
    ],
  },
];

const FOLLOW_US = [
  { label: "Facebook", href: "https://www.facebook.com/HeroesaChampions" },
  { label: "Instagram", href: "https://www.instagram.com/heroes.champions" },
];

export function Footer() {
  return (
    <footer className="w-full flex flex-col bg-black text-white">
      <div className="flex flex-row flex-wrap px-12 pt-8 pb-8">
        <div className="w-full sm:w-1/4 flex flex-col items-start gap-2 pr-4 mb-6">
          <Image
            src={logo}
            alt="Heroes & Champions logo"
            className="h-[70px] w-[170px] object-scale-down mb-3"
          />
          <p className="font-bold text-sm uppercase tracking-wider mb-1">Follow Us</p>
          {FOLLOW_US.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-white/65 hover:text-white text-sm transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div key={section.heading} className="w-full sm:w-1/4 flex flex-col items-start gap-2 pr-4 mb-6">
            <p className="font-bold text-sm uppercase tracking-wider mb-1">{section.heading}</p>
            {section.items.map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5 w-full">
                <Link
                  href={item.href}
                  className="text-white/65 hover:text-white text-sm transition-colors duration-200"
                >
                  {item.label}
                </Link>
                {"address" in item && (
                  <>
                    <p className="text-white/45 text-xs leading-relaxed">{item.address}</p>
                    <p className="text-white/45 text-xs">{item.phone}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center py-4">
        <div className="w-9/10 border-t border-white/20 mb-4" />
        <p className="text-white/40 text-xs">© 2026 Heroes & Champions Comics. All rights reserved.</p>
      </div>
    </footer>
  );
}